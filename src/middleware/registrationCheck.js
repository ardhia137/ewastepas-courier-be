import { prisma } from "../database.js";
import { sendOTPEmail } from "../controllers/authController.js";

export const emailCheck = async (req, res, next) => {
    const {email} = req.body

    const courier = await prisma.courier.findUnique({
        where: {
            email: email
        }
    })

    if(courier){

        if(!courier.is_verified){
            try {
                await sendOTPEmail(email);
                return res.status(200).json({message: "OTP send to your email"})
            } catch (error) {
                return res.status(500).json({error: error})
            }
        }
        return res.status(409).json({error: "This email is already registered"})
    }
    next()
}