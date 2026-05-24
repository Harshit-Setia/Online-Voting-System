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
  - Accessible by Admin AND Superadmin
*/
router.get("/", 
  authMiddleware, 
  roleMiddleware(["admin", "superadmin"]), 
  getAllUsers
)

router.post("/",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  validate(addUserSchema),
  addUser
)

router.delete("/:id", 
  authMiddleware, 
  roleMiddleware(["admin", "superadmin"]), 
  validate(userIdSchema),
  deleteUser
)


// update UserRole(only superadmin has right to do so)
router.patch("/:id/role",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  validate(updateUserRoleSchema),
  updateUserRole
)


// verify account
router.patch("/:id/verify",
  authMiddleware,
  roleMiddleware(["superadmin","admin"]),
  validate(userIdSchema),
  verifyUser
)


// suspend user
router.patch("/:id/suspend",
  authMiddleware,
  roleMiddleware(["superadmin","admin"]),
  validate(userIdSchema),
  suspendUser
)
router.post(
  "/promote",
  validate(promoteUserSchema),
  promoteUser
)

export default router