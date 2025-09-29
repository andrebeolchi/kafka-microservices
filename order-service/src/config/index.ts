import dotenv from 'dotenv';
dotenv.config();

export const APP_PORT = process.env.APP_PORT

export const DATABASE_URL = process.env.DATABASE_URL

export const CATALOG_BASE_URL = process.env.CATALOG_BASE_URL || "http://localhost:3000"

export const USER_BASE_URL = process.env.USER_BASE_URL || "http://localhost:3002"

export const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || "order-service"

export const KAKFA_GROUP_ID = process.env.KAKFA_GROUP_ID || "order-service-group"

export const KAFKA_BROKERS = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",") : ["localhost:9092"]