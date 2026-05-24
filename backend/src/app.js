import express from "express"
import morgan from "morgan"
import cors from "cors"
import authRouter from "./modules/auth/auth.routes.js"
import candidateRouter from "./modules/candidates/candidate.routes.js"
import electionRouter from "./modules/elections/election.routes.js"
import resultRouter from "./modules/results/result.routes.js"
import userRouter from "./modules/users/user.routes.js"
import voteRouter from "./modules/votes/vote.routes.js"
import rateLimit from "express-rate-limit"
import errorMiddleware from "./middleware/error.middleware.js"
import AppError from "./utils/AppError.js"
const app=express()

// middlewares
app.use(express.json())
app.use(morgan("dev"))
app.use(cors())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5000, // Limit each IP to 5000 requests per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})
app.use("/api", limiter)

// routes
app.use("/api/auth",authRouter)
app.use("/api/votes",voteRouter)
app.use("/api/elections",electionRouter)
app.use("/api/candidates",candidateRouter)
app.use("/api/results",resultRouter)
app.use("/api/users",userRouter)

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

// Global error handling middleware
app.use(errorMiddleware)

export default app