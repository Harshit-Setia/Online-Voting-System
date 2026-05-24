import { z } from "zod"

export const createElectionSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    start_time: z.string().datetime({ message: "Invalid ISO 8601 datetime format for start_time" }),
    end_time: z.string().datetime({ message: "Invalid ISO 8601 datetime format for end_time" })
  })
})

export const electionIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Election ID is required")
  })
})

export const updateElectionSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Election ID is required")
  }),
  body: z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().optional(),
    start_time: z.string().datetime({ message: "Invalid ISO 8601 datetime format for start_time" }).optional(),
    end_time: z.string().datetime({ message: "Invalid ISO 8601 datetime format for end_time" }).optional(),
    status: z.enum(["upcoming", "active", "ended"]).optional()
  })
})

