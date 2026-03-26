import * as userService from "./user.service.js"

/*
GET /api/users/me
*/
export const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id)
    res.json(user)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}

/*
GET /api/users
(Admin only)
*/
export const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers()
  res.json(users)
}

/*
DELETE /api/users/:id
(Admin only)
*/
export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id)
    res.json({ message: "User deleted" })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}