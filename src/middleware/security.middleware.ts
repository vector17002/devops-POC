import type { NextFunction, Request, Response } from 'express'
import logger from '../config/logger.js'
import aj from '../config/arcjet.js'
import { slidingWindow } from '@arcjet/node'

export const securityMiddleware = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { role = "guest" } = req.user || {}
        let limit: number
        let message: string
        switch (role) {
            case "admin":
                limit = 20
                message = "Admin request limit exceeded (20 per minute). Slow down...."
                break;
            case "user":
                limit = 10
                message = "User request limit exceeded (10 per minute). Slow down...."
                break;
            default:
                limit = 5
                message = "Guest request limit exceeded (5 per minute). Slow down...."
                break;
        }

        const client = aj.withRule(slidingWindow({ mode: 'LIVE', interval: '1m', max: limit }));

        const decision = await client.protect(req);

        if (decision.isDenied() && decision.reason.isBot()) {
            logger.warn('Arcjet: Bot detected', {
                ip: req.ip,
                reason: decision.reason,
                ua: req.get('User-Agent')
            })
            return res.status(403).json({
                status: 'error',
                message: 'Bot detected',
                // Adding reason in development for easier debugging
                debug: process.env.NODE_ENV === 'development' ? decision.reason : undefined
            })
        }

        if (decision.isDenied() && decision.reason.isShield()) {
            logger.warn('Arcjet: Shield detected', {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                reason: decision.reason
            })
            return res.status(403).json({
                status: 'error',
                message: 'Shield detected',
                debug: process.env.NODE_ENV === 'development' ? decision.reason : undefined
            })
        }

        if (decision.isDenied() && decision.reason.isRateLimit()) {
            logger.warn('Arcjet: Rate limit exceeded', {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                reason: decision.reason
            })
            return res.status(403).json({
                status: 'error',
                message: 'Rate limit exceeded',
                debug: process.env.NODE_ENV === 'development' ? decision.reason : undefined
            })
        }

        next()
    } catch (error) {
        logger.error('Arcjet middleware error', error)
        console.log('Arcjet middleware error', error)
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong with security middleware',
            error: error
        })
    }
}

export default securityMiddleware
