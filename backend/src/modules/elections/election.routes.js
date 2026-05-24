import { Router } from "express"
import authMiddleware from "../../middleware/auth.middleware.js"
import roleMiddleware from "../../middleware/role.middleware.js"
import validate from "../../middleware/validate.middleware.js"
import { createElectionSchema, electionIdSchema, updateElectionSchema } from "./election.schema.js"
import { createElection, endElection, getAllElections, getElectionById, startElection, deleteElection, updateElection } from "./election.controller.js"

const router = Router()

// admin & superadmin
router.post("/", authMiddleware, roleMiddleware(["admin", "superadmin"]), validate(createElectionSchema), createElection)
router.put("/:id", authMiddleware, roleMiddleware(["admin", "superadmin"]), validate(updateElectionSchema), updateElection)
router.put("/start/:id", authMiddleware, roleMiddleware(["admin", "superadmin"]), validate(electionIdSchema), startElection)
router.put("/end/:id", authMiddleware, roleMiddleware(["admin", "superadmin"]), validate(electionIdSchema), endElection)

// public
router.get("/", getAllElections)
router.get("/:id", validate(electionIdSchema), getElectionById);
router.delete("/:id", authMiddleware, roleMiddleware(["admin", "superadmin"]), validate(electionIdSchema), deleteElection)

export default router