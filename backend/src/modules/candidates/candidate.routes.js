import express from "express"
import authMiddleware from "../../middleware/auth.middleware.js"
import roleMiddleware from "../../middleware/role.middleware.js"
import upload from "../../middleware/upload.middleware.js"
import {
    addCandidate,
    deleteCandidate,
    getCandidates
} from "./candidate.controller.js"


const router = express.Router()

// admin
router.post("/", authMiddleware, roleMiddleware("admin"),upload.single("photo"), addCandidate)
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteCandidate)

// public
router.get("/:electionId", getCandidates)

export default router