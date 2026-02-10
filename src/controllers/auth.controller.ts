import logger from "#config/logger.js";
import { formatValidationErrors } from "#utils/format.js";
import { authValidation } from "#validations/auth.validation.js";
import type { NextFunction, Request, Response } from "express";
import { createUser } from "#services/auth.service.js";

export const authController = {
    signUp: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password, role } = req.body;
            const validation = authValidation.signUp.safeParse({ name, email, password, role });
            if (!validation.success) {
                return res.status(400).json({
                    status: 'error',
                    error: 'Validation Failed',
                    message: formatValidationErrors(validation.error),
                });
            }
            const user = await createUser(validation.data);
            if (user) {
                logger.info(`User signed up successfully: ${validation.data}`);
                res.status(200).json({
                    status: 'Success',
                    message: 'User signed up successfully',
                });
            } else {
                logger.error(`Error signing up user: ${user}`);
                res.status(500).json({
                    status: 'error',
                    message: 'Failed to sign up user',
                });
            }
        } catch (error) {
            logger.error(`Error signing up user: ${error}`);
            res.status(500).json({
                status: 'error',
                message: 'Failed to sign up user',
            });
        }
    },
    signIn: (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const validation = authValidation.signIn.safeParse({ email, password });
            if (!validation.success) {
                return res.status(400).json({
                    status: 'error',
                    message: formatValidationErrors(validation.error),
                });
            }
            logger.info(`User signed in successfully: ${validation.data}`);
            res.status(200).json({
                status: 'success',
                message: 'User signed in successfully',
            });
        } catch (error) {
            logger.error(`Error signing in user: ${error}`);
            res.status(500).json({
                status: 'error',
                message: 'Failed to sign in user',
            });
        }
    },
    signOut: (req: Request, res: Response) => {
        try {
            res.status(200).json({
                status: 'success',
                message: 'User signed out successfully',
            });
        } catch (error) {
            logger.error(`Error signing out user: ${error}`);
            res.status(500).json({
                status: 'error',
                message: 'Failed to sign out user',
            });
        }
    }
}