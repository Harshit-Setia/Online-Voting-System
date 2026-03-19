import * as authService from "./auth.service.js"

// register API
export const register=async(req,res)=>{
    try {
        const user=await authService.registerUser(req.body)

        res.status(201).json({message:"User registered successfully",userID:user.id})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

// login API
export const login=async(req,res)=>{
    try {
        const {user,token}=await authService.loginUser(req.body)

        res.json({
            token,
            user:{
                id:user.id,
                name:user.name,
                role:user.role
            }
        })
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}