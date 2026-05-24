import express from "express"
import authMiddleware from "../../middleware/auth.middleware.js"
import roleMiddleware from "../../middleware/role.middleware.js"
import upload from "../../middleware/upload.middleware.js"
import validate from "../../middleware/validate.middleware.js"
import { addCandidateSchema, candidateIdSchema, getCandidatesSchema } from "./candidate.schema.js"
import {
    addCandidate,
    deleteCandidate,
    getCandidates,
    updateCandidate
} from "./candidate.controller.js"


const router = express.Router()

// admin & superadmin
router.post("/", authMiddleware, roleMiddleware(["admin", "superadmin"]), upload.single("photo"), validate(addCandidateSchema), addCandidate)
router.delete("/:id", authMiddleware, roleMiddleware(["admin", "superadmin"]), validate(candidateIdSchema), deleteCandidate)

// public
router.get("/:electionId", validate(getCandidatesSchema), getCandidates)

router.put('/:id', authMiddleware, roleMiddleware(["admin", "superadmin"]), validate(candidateIdSchema), updateCandidate)

export default router