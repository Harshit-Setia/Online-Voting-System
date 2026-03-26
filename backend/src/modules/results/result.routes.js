import {Router} from "express"
import { getResults,getWinner } from "./result.controller.js"

const router=Router()

router.get("/:electionId",getResults)
router.get("/:electionId/winner",getWinner)

export default router