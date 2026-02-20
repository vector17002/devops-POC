import bcrypt from 'bcrypt';
import logger from '#config/logger.js';
import db from '#config/database.js';
import { users } from '#db/user.model.js';
import { eq } from 'drizzle-orm';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const createUser = async ({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}) => {
  try {
    // const existingUser = await db.db.select().from(users).where(eq(users.email, email));
    // if (existingUser.length > 0) {
    //     logger.error('User already exists', { email });
    //     throw new Error('User already exists');
    // }
    const hashedPassword = await hashPassword(password);
    const user = await db.db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });
    logger.info('New user created successfully', { email: email });
    return user;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
