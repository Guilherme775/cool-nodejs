import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

type TokenPaylod = {
    id: string,
    iat: number,
    exp: number,
}

const prisma = new PrismaClient();

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({
                message: 'Not authorized :('
            });
        }

        const token = authorization.replace('Bearer', '').trim();

        const data = jwt.verify(token, 'secret');

        const { id } = data as TokenPaylod;

        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.send(400).json({
                message: 'User not exist :('
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({
                message: 'Not authorized :('
            });
        }

        if (Number(id) != user.id) {
            return res.status(401).json({
                message: 'Not authorized :('
            });
        }

        return next();
    } catch (e) {
        return res.status(400).json({
            message: 'Bad Request :(',
        });
    }
}