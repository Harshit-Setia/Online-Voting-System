import express from "express"
import morgan from "morgan"
import authRouter from "./modules/auth/auth.routes.js"
import candidateRouter from "./modules/candidates/candidate.routes.js"
import electionRouter from "./modules/elections/election.routes.js"
import resultRouter from "./modules/results/result.routes.js"
import voteRouter from "./modules/votes/vote.routes.js"

const app=express()

// middlewares
app.use(express.json())
app.use(morgan("dev"))

// routes
app.use("/api/auth",authRouter)
app.use("/api/votes",voteRouter)
app.use("/api/elections",electionRouter)
app.use("/api/candidate",candidateRouter)
app.use("/api/results",resultRouter)

export default app