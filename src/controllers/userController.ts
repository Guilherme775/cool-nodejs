import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mailQueue } from '../lib/queue'

const prisma = new PrismaClient();

export const create = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const userExist = await prisma.user.findUnique({ where: { email } });

        if (userExist) {
            return res.status(409).json({
                message: 'User already exist'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword
            }
        });

        await mailQueue.add({ name, email });

        return res.status(200).json({
            message: 'User created'
        });
    } catch (e) {
        return res.status(400).json({
            message: 'Bad Request :(',
        });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        await prisma.product.deleteMany({ where: { userId: user?.id } });
        await prisma.user.delete({ where: { id: user?.id } });

        return res.status(200).json({
            message: 'User deleted'
        });
    } catch (e) {
        console.log(e);

        return res.status(400).json({
            message: 'Bad Request :(',
        });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
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

        const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1d' });

        return res.status(200).json({
            token
        });
    } catch (e) {
        return res.status(400).json({
            message: 'Bad Request :(',
        });
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, newPassword } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);

        const user = await prisma.user.findUnique({ where: { email } });

        await prisma.user.update({
            where: {
                id: user?.id,
            },
            data: {
                password: hashPassword,
            }
        });

        return res.status(200).json({
            message: 'Password updated :)'
        });
    } catch (e) {
        return res.status(400).json({
            message: 'Bad Request :(',
        });
    }
}
