import AppError from "../../utils/AppError.js"
import * as userService from "./user.service.js"



/*
GET /api/users/me
*/
export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

/*
GET /api/users
(Admin only)
*/
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers()
    res.json(users)
  } catch (error) {
    next(error)
  }
}

/*
POST /api/users
(God only usually, or admin if allowed)
*/
export const addUser = async (req, res, next) => {
  try {
    // Only god can create admins or gods. Admin can only create voters.
    if (req.user.role === "admin" && req.body.role && req.body.role !== "voter") {
      return next(new AppError("Admins can only add voter accounts", 403))
    }

    const user = await userService.addUser(req.body)
    res.status(201).json({
      message: "User added successfully",
      user
    })
  } catch (error) {
    next(error)
  }
}

/*
DELETE /api/users/:id
(Admin only)
*/
export const deleteUser = async (req, res, next) => {
  try {
       // god can delete any but not themselves
       if(req.user.id == req.params.id && req.user.role === "god"){
        return next(new AppError("A god cannot delete their own account. Please contact another god to delete your account.", 400))
       }

    await userService.deleteUser(req.params.id)
    res.json({ message: "User deleted" })
  } catch (error) {
    next(error)
  }
}


// Update user details (god can only update)
export const updateUserRole = async(req, res, next) =>{
  try{
    const { id } = req.params
    const { role } = req.body

    if(req.user.id == id && req.user.role === "god" && role !== "god" ){
      return next(new AppError("A god cannot demote themselves. Please contact another god to change your role.", 400))
    }

    const updatedUser = await userService.updateUserRole(id, role)
     
    const userJson = updatedUser.toJSON()
    delete userJson.password


    res.status(200).json({
      message: `User role updated successfully to ${role}`,
      user: userJson,
    })

  }catch(error){
    next(error)
  }
}

export const promoteUser = async (req, res, next) => {
  try {
    const { email, role, secret } = req.body

    if (secret !== process.env.PROMOTE_SECRET) {
      return next(new AppError("Unauthorized", 401))
    }

    const user = await userService.getUserByEmail(email)
    user.role = role
    await user.save()

    const userJson = user.toJSON()
    delete userJson.password

    res.status(200).json({
      message: `User role updated successfully to ${role}`,
      user: userJson,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async(req, res, next)=>{
  try {
    const userId = req.user.id

    const { email, password } = req.body;

    const updateData = await userService.updateProfile(userId, { email, password })

    const userJson = updateData.toJSON()
    delete userJson.password

    res.status(200).json({
      message: "Profile updated successfully",
      user: userJson,
    })
  } catch (error) {
    next(error)
  }
}


export const verifyUser = async(req, res, next) =>{
  try {
    const { id } = req.params

    const updatedUser = await userService.verifyUserAccount(id)

    const userJson = updatedUser.toJSON()
    delete userJson.password

    res.status(200).json({
      message: "User account verified successfully",
      user: userJson,  
    })
  } catch (error) {
    next(error)
  }
}

export const suspendUser = async(req, res, next)=>{
  try {
    const { id } = req.params

    if(req.user.id == id){
      return next(new AppError("You cannot suspend your own account", 400))
    }
    const updatedUser = await userService.suspendUserAccount(id) 
    
    if(updatedUser.role === "god" && req.user.role !== "god"){
      updatedUser.isSuspended = false
      await updatedUser.save()
      return next(new AppError("Admins cannot suspend a god-level user.", 403))
    }
    const userJson = updatedUser.toJSON()
    delete userJson.password

    res.status(200).json({
      message: "User account suspended successfully",
      user: userJson,
    })
  } catch (error) {
    next(error)
  }
}