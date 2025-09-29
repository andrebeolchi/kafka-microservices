import dotenv from "dotenv";

dotenv.config()

export const APP_PORT = process.env.APP_PORT || 3002

export const DATABASE_URL = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/userdb"

export const JWT_SECRET = process.env.JWT_SECRET || "secret"
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1d" 