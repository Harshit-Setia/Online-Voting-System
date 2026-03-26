import "dotenv/config"

// port
export const PORT=process.env.PORT

// DB
export const DB_NAME=process.env.DB_NAME
export const DB_USER=process.env.DB_USER
export const DB_PASSWORD=process.env.DB_PASSWORD
export const DB_HOST=process.env.DB_HOST
export const DB_DIALECT=process.env.DB_DIALECT

// JWT
export const JWT_SECRET=process.env.JWT_SECRET

// Cloudinary
export const CLOUD_NAME=process.env.CLOUD_NAME
export const CLOUD_API_KEY=process.env.CLOUD_API_KEY
export const CLOUD_API_SECRET=process.env.CLOUD_API_SECRET