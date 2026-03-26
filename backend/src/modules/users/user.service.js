import User from "./user.model.js"

export const getProfile=async(userId)=>{
    const user=await User.findByPk(userId,{
        attributes:["id","name","email","role","is_verified"]
    })

    if(!user)throw Error("User not found")

    return user
}

export const getAllUsers=async()=>{
    return User.findAll({
        attributes:["id","name","email","role","is_verified"]
    })
}

export const deleteUser=async(id)=>{
    const user=await User.findByPk(id)

    if(!user)throw Error("User not found")

    await user.destroy()
    return true
}