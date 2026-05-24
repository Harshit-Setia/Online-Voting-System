import { z } from "zod"

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required")
  })
})

export const updateUserRoleSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required")
  }),
  body: z.object({
    role: z.enum(["voter", "admin", "god"])
  })
})

export const updateProfileSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").optional(),
    password: z.string().min(6, "Password must be at least 6 characters long").optional()
  }).refine(data => data.email || data.password, {
    message: "At least one field email/password must be provided for update",
    path: ["email"]
  })
})

export const addUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["voter", "admin", "god"]).optional(),
    isVerified: z.boolean().optional()
  })
})

export const promoteUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    role: z.enum(["admin", "god"]),
    secret: z.string().min(1, "Secret is required")
  })
})

