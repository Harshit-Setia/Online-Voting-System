import express from "express"
import authRouter from "./modules/auth/auth.routes.js"
import voteRouter from "./modules/votes/vote.routes.js"
import morgan from "morgan"
const app=express()

// middlewares
app.use(express.json())
app.use(morgan("dev"))

// routes
app.use("/api/auth",authRouter)
app.use("/api/votes",voteRouter)

export default app