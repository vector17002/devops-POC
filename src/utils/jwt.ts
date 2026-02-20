import jwt, { sign } from 'jsonwebtoken';
import logger from '#config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = '1d';

export const jwttoken = {
  sign: (payload: any) => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
      logger.error(`Error generating token: ${error}`);
      throw new Error('Failed to generate token');
    }
  },
  verify: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error(`Error verifying token: ${error}`);
      throw new Error('Failed to verify token');
    }
  },
  decode: (token: string) => {
    try {
      return jwt.decode(token);
    } catch (error) {
      logger.error(`Error decoding token: ${error}`);
      throw new Error('Failed to decode token');
    }
  },
};
