import express from "express"
import authMiddleware from "../../middleware/auth.middleware.js"
import roleMiddleware from "../../middleware/role.middleware.js"
import validate from "../../middleware/validate.middleware.js"

import {
    addUser,
    deleteUser,
    getAllUsers,
    getProfile,
    promoteUser,
    suspendUser,
    updateProfile,
    updateUserRole,
    verifyUser
} from "./user.controller.js"
import { addUserSchema, promoteUserSchema, updateProfileSchema, updateUserRoleSchema, userIdSchema } from "./user.schema.js"

const router = express.Router()

/*
Protected routes
*/
router.get("/me", authMiddleware, getProfile)

router.patch("/me/update",
  authMiddleware,
  validate(updateProfileSchema),
  updateProfile
)



/*
  ADMIN ROUTES (Election Officers)
  - Accessible by Admin AND God
*/
router.get("/", 
  authMiddleware, 
  roleMiddleware(["admin", "god"]), 
  getAllUsers
)

router.post("/",
  authMiddleware,
  roleMiddleware(["admin", "god"]),
  validate(addUserSchema),
  addUser
)

router.delete("/:id", 
  authMiddleware, 
  roleMiddleware(["admin", "god"]), 
  validate(userIdSchema),
  deleteUser
)


// update UserRole(only god has right to do so)
router.patch("/:id/role",
  authMiddleware,
  roleMiddleware(["god"]),
  validate(updateUserRoleSchema),
  updateUserRole
)


// verify account
router.patch("/:id/verify",
  authMiddleware,
  roleMiddleware(["god","admin"]),
  validate(userIdSchema),
  verifyUser
)


// suspend user
router.patch("/:id/suspend",
  authMiddleware,
  roleMiddleware(["god","admin"]),
  validate(userIdSchema),
  suspendUser
)
router.post(
  "/promote",
  validate(promoteUserSchema),
  promoteUser
)

export default router