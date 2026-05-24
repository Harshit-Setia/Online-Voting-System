import "dotenv/config"

// port
export const PORT = process.env.PORT || 3000

// DB
export const DB_NAME = process.env.DB_NAME
export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_HOST = process.env.DB_HOST
export const DB_PORT = process.env.DB_PORT || (process.env.DB_DIALECT === "mssql" ? 1433 : 3306)
export const DB_INSTANCE = process.env.DB_INSTANCE
export const DB_DIALECT = process.env.DB_DIALECT || "mysql"
export const DATABASE_URL = process.env.DATABASE_URL

// JWT
export const JWT_SECRET = process.env.JWT_SECRET

// Cloudinary
export const CLOUD_NAME = process.env.CLOUD_NAME
export const CLOUD_API_KEY = process.env.CLOUD_API_KEY
export const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET

export const PROMOTE_SECRET = process.env.PROMOTE_SECRET || ""