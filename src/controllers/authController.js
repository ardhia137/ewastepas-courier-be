import 'dotenv/config'
import speakeasy from 'speakeasy'
import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import { prisma } from '../database.js'
import { json } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



const {EMAIL,SECRET_KEYS,CLIENT_ID,CLIENT_SECRET,REDIRECT_URL,REFRESH_TOKEN} = process.env

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URL)

const generatorOTP = () => {
    const otp = speakeasy.totp({
        secret: SECRET_KEYS,
        encoding: 'base32',
        step: 180
    })
    return otp
}

const generateJWT = (payload, expiresIn) => {
    const token = jwt.sign(payload, SECRET_KEYS, {expiresIn: expiresIn})
    return token
}

const generatePassword = (password) => {
    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds)
    const passwordHash = bcrypt.hashSync(password, salt)
    return passwordHash
}

// sign in google

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
];

const authorizationUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true
})

export const redirectAuth = (req, res) => {
    res.redirect(authorizationUrl)
}

export const googleLogin = async (req, res) => {
    const {code} = req.query

    const {tokens} = await oAuth2Client.getToken(code)

    oAuth2Client.setCredentials(tokens)

    const oauth2 = google.oauth2({
        auth: oAuth2Client,
        version: 'v2'
    })

    const {data} = await oauth2.userinfo.get()

    if(!data){
        res.status(404).json({error: 'User info not found'})
    }

    let courier = await prisma.courier.findUnique({
        where: {
            email: data.email
        }
    })

    if(!courier){
        courier = await prisma.courier.create({
            data: {
                email: data.email,
                name: data.name,
                is_verified: true
            }
        })
    }

    const payload = {
        id: courier.courier_id,
        email: courier.email,
        name: courier.name,
        
    }

    const expiresIn = 60 * 60 *6
    const token = generateJWT(payload, expiresIn)
    return res.status(200).json({message: 'Login successful', token: token, user: payload})
}

export const sendOTPEmail = async (email) => {
    oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})
    const accessToken = await oAuth2Client.getAccessToken()
    const otp = generatorOTP()

    const transporter = nodemailer.createTransport({
        service: 'gmail',  
        auth: {
            type: 'OAuth2',
            user: EMAIL,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken
        }
    })

    const info = await transporter.sendMail({
        from: `"OTP Service E-Wastepas" ${EMAIL}`,
        to: email,
        subject: 'Your OTP Verification Code',
        text: `Your OTP code is: ${otp}`
    });

    console.log('Message sent: %s', info.messageId)
}


export const registration = async (req, res) => {
    const { email, password, confirm_password } = req.body

    if(!email || !password || !confirm_password){
        return res.status(400).json({error: 'Required fields are missing. Please complete all required fields.'})
    }

    if(password !== confirm_password){
        return res.status(400).json({error: 'Both passwords must be the same. Please check and re-enter.'})
    }

    const passwordHash = generatePassword(password)
    const name = email.split("@")[0];

    try {
        const newCourier = await prisma.courier.create({
            data: {
                email: email,
                password: passwordHash,
                name: name,
            }
        })
        
        await sendOTPEmail(email)

        return res.status(201).json({ message: 'Registration successful.', created_at: newCourier.created_at})
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'An error occurred during login'})
    }

}

export const verifyOTP = async (req,res) => { 
    const {email, otp, type} = req.body

    if(!otp){
        return res.status(400).json({error: 'OTP is required.'})
    }

    const tokenValidates = speakeasy.totp.verify({
        secret: SECRET_KEYS,
        encoding: 'base32',
        token: otp,
        step: 180,
        window:1
    })

    if(!tokenValidates){
        return res.status(400).json({error: 'Invalid OTP'})
    }
    
    if(type === 'registration'){
        try {
            await prisma.courier.update({
                where: {
                    email: email
                },
                data: {
                    is_verified: true
                }
            })
            return res.status(200).json({message: 'User has been verified.'})
        } catch (error) {
            console.error(error)
        }
    } else if (type === 'forgot_password') {

        const expiresIn = 5 * 60
        const payload = {email: email}
        const token = generateJWT(payload, expiresIn)

        return res.status(200).json({token: token})
    } else {
        return res.status(400).json({error: 'Invalid type'})
    }
    
}

export const login = async (req, res) => {
    const {email, password} = req.body

    try {
        const courier = await prisma.courier.findUnique({
            where: { email: email }
        })
    
        if(!courier){
            return res.status(404).json({error: "Incorrect email or password"})
        }
    
        if(!courier.is_verified){
            try {
                await sendOTPEmail(email);
                return res.status(200).json({message: "OTP send to your email"})
            } catch (error) {
                return res.status(500).json({error: error})
            }
        }
    
        const match = await bcrypt.compare(password, courier.password);
    
        if(match){
            const payload = {
                id: courier.courier_id,
                email: courier.email,
                name: courier.name
            }
            const expiresIn = 60 * 60 *6
            const token = generateJWT(payload, expiresIn)
            return res.status(200).json({message: 'Login successful', token: token, user: payload})
        } else {
            return res.status(400).json({error: 'Incorrect email or password'})
        } 
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'An error occurred during login'})
    }
}

export const forgotPassword = async (req, res) => {
    const {email} = req.payload
    const {new_password, confirm_new_password} = req.body

    if(!new_password || !confirm_new_password) {
        return res.status(400).json({error: 'Required fields are missing. Please complete all required fields.'})
    }

    if(new_password !== confirm_new_password) {
        return res.status(400).json({error: 'Both passwords must be the same. Please check and re-enter.'})
    }

    const passwordHash = generatePassword(new_password)

    try {
        await prisma.courier.update({
            where: {
                email: email
            },
            data: {
                password: passwordHash
            }
        })

        return res.status(200).json({message: 'Change password succesfully.'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Change password failed.'})
    }
}

export const sendOTP = async (req, res) => {
    const {email} = req.body

    try {
        const courier = await prisma.courier.findUnique({
            where: {email: email}
        })

        if(!courier){
            return res.status(404).json({ error: 'User not found'})
        }

        await sendOTPEmail(email)

        const currentTime = new Date().toISOString()
        
        return res.status(200).json({ 
            message: 'OTP send to your email',
            created_at: currentTime
        })

    } catch(error){
        console.error(error)
        return res.status(500).json({error: 'Failed send OTP email'})
    }
}
