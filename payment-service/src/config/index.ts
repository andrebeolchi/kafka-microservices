import dotenv from 'dotenv';
dotenv.config();

export const APP_PORT = process.env.APP_PORT || 3003;

export const ORDER_BASE_URL = process.env.ORDER_BASE_URL || 'http://localhost:3001';

export const USER_BASE_URL = process.env.USER_BASE_URL || 'http://localhost:3002';

export const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || "payment-service"

export const KAKFA_GROUP_ID = process.env.KAKFA_GROUP_ID || "payment-service-group"

export const KAFKA_BROKERS = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(",") : ["localhost:9092"]