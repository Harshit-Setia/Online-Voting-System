import jwt from "jsonwebtoken"
import { JWT_SECRET } from "./constants.js"

// generate token
export const generateToken = (user)=>{
    return jwt.sign(
        {
            id:user.id,
            role:user.role
        },
        JWT_SECRET,
        {expiresIn:"1d"}
    )
}