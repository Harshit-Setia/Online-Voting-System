import User from "../users/user.model.js"
import { hashPassword, comparePassword } from "../../utils/hash.js"
import { generateToken } from "../../utils/jwt.js"
import AppError from "../../utils/AppError.js"
import crypto from "crypto"
import { sendEmail } from "../../utils/mailer.js"


// register user
export const registerUser = async ({name, email, password}) => {
    const existingUser = await User.findOne({where:{email}})
    if(existingUser){
        throw new AppError("Email already registered", 400)
    }

    const userCount = await User.count()
    const assignedRole = userCount === 0 ? "superadmin" : "voter"

    const hashedPassword = await hashPassword(password)
    
    const verificationToken = crypto.randomBytes(32).toString("hex")

    const user = await User.create({
        name,
        email,
        password: hashedPassword,   
        role: assignedRole, // default role is voter
        verificationToken
    })

    // Send Verification Email
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`
    const message = `Please verify your email by clicking the following link: \n\n ${verifyUrl}`
    
    try {
        await sendEmail(user.email, "Email Verification - Online Voting System", message)
    } catch (error) {
        // Log it, but don't fail registration
        console.error("Failed to send verification email to", user.email)
    }

    const userJson = user.toJSON()
    delete userJson.password

    return userJson
}

export const verifyEmail = async (token) => {
    const user = await User.findOne({ where: { verificationToken: token } })

    if (!user) {
        throw new AppError("Invalid or expired verification token", 400)
    }

    user.isVerified = true
    user.verificationToken = null
    await user.save()

    return true
}

// login user
export const loginUser = async({email,password})=>{
    console.log('Attempting login for', email);
    const user = await User.findOne({ where: { email } });
    if(!user){
        throw new AppError("Invalid Email or Password", 401)
    }

    const isMatch=await comparePassword(password,user.password)

    if(!isMatch){
        throw new AppError("Invalid Email or Password", 401)
    }

    const token = generateToken(user)


    // delete data before sending response to frontend
    const userJson = user.toJSON();
    delete userJson.password;

    return {user: userJson,token}
}