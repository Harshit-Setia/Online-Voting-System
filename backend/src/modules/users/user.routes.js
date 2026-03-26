import express from "express"
import authMiddleware from "../../middleware/auth.middleware.js"
import roleMiddleware from "../../middleware/role.middleware.js"
import {
  getProfile,
  getAllUsers,
  deleteUser
} from "./user.controller.js"

const router = express.Router()

/*
Protected routes
*/
router.get("/me", authMiddleware, getProfile)

/*
Admin routes
*/
router.get("/", authMiddleware, roleMiddleware("admin"), getAllUsers)
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteUser)

export default router