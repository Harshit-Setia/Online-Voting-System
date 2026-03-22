import {Router} from "express"
import authMiddleware from "../../middleware/auth.middleware.js"
import roleMiddleware from "../../middleware/role.middleware.js"
import { createElection, endElection, getAllElections, getElectionById, startElection } from "./election.controller.js"

const router=Router()

// admin
router.post("/",authMiddleware,roleMiddleware("admin"),createElection)
router.put("/start/:id",authMiddleware,roleMiddleware("admin"),startElection)
router.put("/end/:id",authMiddleware,roleMiddleware("admin"),endElection)

// public
router.get("/",getAllElections)
router.get("/:id",getElectionById)

export default router