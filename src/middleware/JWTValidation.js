import jwt from 'jsonwebtoken'

export const JWTValidation = (req, res, next) => {
    const { authorization } = req.headers
    
    if (!authorization) {
        res.sendStatus(401);
    }
    
    const jwtToken = authorization.split(' ')[1];
    const { SECRET_KEYS } = process.env

    jwt.verify(jwtToken, SECRET_KEYS ,(err, decode) => {
        if(err) return res.sendStatus(403)
        req.payload = {
            id: decode.id,
            email: decode.email,
            name: decode.name
        }
        next();
    } );

}