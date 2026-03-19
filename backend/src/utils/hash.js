import bcrypt from "bcrypt"

// hash password
export const hashPassword=async (password)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}

// compare password
export const comparePassword = async (password,hash)=>{
    return bcrypt.compare(password,hash)
}