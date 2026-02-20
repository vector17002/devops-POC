import { z } from 'zod';

export const authValidation = {
  signUp: z.object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters long')
      .max(50, 'Name must be at most 50 characters long'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .max(20, 'Password must be at most 20 characters long'),
    role: z.enum(['user', 'admin']).default('user'),
  }),
  signIn: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
};
