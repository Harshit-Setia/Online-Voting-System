import express from "express"
import authRouter from "./modules/auth/auth.routes.js"
import morgan from "morgan"
const app=express()

// middlewares
app.use(express.json())
app.use(morgan("dev"))

// routes
app.use("/api/auth",authRouter)

export default app