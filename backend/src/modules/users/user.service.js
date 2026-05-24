import AppError from "../../utils/AppError.js"
import { hashPassword } from "../../utils/hash.js"
import User from "./user.model.js"

export const getProfile=async(userId)=>{
    const user=await User.findByPk(userId,{
        attributes:["id","name","email","role","isVerified","isSuspended"]
    })

    if(!user)throw new AppError("User not found", 404)

    return user
}

export const addUser = async (userData) => {
    const existingUser = await User.findOne({ where: { email: userData.email } })
    if (existingUser) {
        throw new AppError("Email already registered", 400)
    }

    const hashedPassword = await hashPassword(userData.password)

    const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || "voter",
        isVerified: userData.isVerified !== undefined ? userData.isVerified : true // Usually manually added users are auto-verified
    })

    const userJson = user.toJSON()
    delete userJson.password

    return userJson
}

export const getAllUsers=async()=>{
    return User.findAll({
        attributes:["id","name","email","role","isVerified","isSuspended"]
    })
}

export const deleteUser=async(id)=>{
    const user=await User.findByPk(id)

    if(!user)throw new AppError("User not found", 404)

    await user.destroy()
    return true
}


export const updateUserRole = async(id, role)=>{
    const user = await User.findByPk(id)

    if(!user) throw new AppError("User not found", 404)

    user.role = role
    await user.save()
    return user
}

export const getUserByEmail = async(email) => {
    const user = await User.findOne({ where: { email } })

    if(!user) throw new AppError("User not found", 404)

    return user
}

export const updateProfile = async(id, updateData) =>{
    const user = await User.findByPk(id)

    if(!user) throw new AppError("User not found", 404)

    if (updateData.email) user.email = updateData.email;
    if (updateData.password) user.password = await hashPassword(updateData.password);
    await user.save();
    return user
}


export const verifyUserAccount = async(id) =>{
    const user = await User.findByPk(id)
    if(!user) throw new AppError("User not found", 404)

    user.isVerified = true
    await user.save()

    return user
}

export const suspendUserAccount = async(id) =>{
    const user = await User.findByPk(id)
    if(!user) throw new AppError("User not found", 404)

    user.isSuspended = true
    await user.save()

    return user
}