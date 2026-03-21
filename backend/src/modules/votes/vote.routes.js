import {Router} from "express"
import authMiddleware from "../../middleware/auth.middleware.js"
import { castVote } from "./vote.controller.js"

const router = Router()

router.post("/",authMiddleware,castVote)

export default router