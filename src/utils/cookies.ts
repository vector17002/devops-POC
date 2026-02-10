import type { Request, Response } from "express";

export const cookies = {
    getOptions: () => {
        return {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
        }
    },
    setCookie: (res: Response, name: string, value: string, options = {} as any) => {
        res.cookie(name, value, { ...cookies.getOptions(), ...options });
    },
    getCookie: (req: Request, name: string) => {
        return req.cookies[name];
    },
    clearCookie: (res: Response, name: string, options = {} as any) => {
        res.clearCookie(name, { ...cookies.getOptions(), ...options });
    }
}