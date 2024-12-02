import * as dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const DATABASE_URL = process.env.DATABASE_URL;
export const SERVER_PORT = process.env.SERVER_PORT;
export const AUTH_TOKEN_EXPIRED_TIME = process.env.AUTH_TOKEN_EXPIRED_TIME;
