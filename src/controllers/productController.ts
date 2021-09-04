import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

type TokenPaylod = {
    id: string,
    iat: number,
    exp: number,
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price } = req.body;
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({
                message: 'Not authorized :('
            });
        }

        const token = authorization.replace('Bearer', '').trim();

        const data = jwt.verify(token, 'secret');

        const { id } = data as TokenPaylod;

        const user = await prisma.user.findUnique({ where: { id: Number(id) } });

        if (!user) {
            return res.status(401).json({
                message: 'Not authorized :('
            });
        }

        await prisma.product.create({
            data: {
                name,
                description,
                price,
                userId: user.id,
            }
        });

        return res.status(200).json({
            message: 'Product registered'
        });
    } catch (e) {
        return res.status(400).json({
            message: 'Bad Request :(',
        });
    }
}

export const getProducts = async (req: Request, res: Response) => {
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

        const user = await prisma.user.findUnique({ where: { id: Number(id) } });

        if (!user) {
            return res.status(401).json({
                message: 'Not authorized :('
            });
        }

        const products = await prisma.product.findMany({
            where: { userId: user?.id }, orderBy: [{
                id: 'asc',
            }]
        });

        return res.status(200).json({
            products
        });
    } catch (e) {
        return res.status(400).json({
            message: 'Bad Request :(',
        });
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id, name, description, price } = req.body;
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({
                message: 'Not authorized :('
            });
        }

        const token = authorization.replace('Bearer', '').trim();

        const data = jwt.verify(token, 'secret');

        const { id: tokenId } = data as TokenPaylod;

        const user = await prisma.user.findUnique({ where: { id: Number(tokenId) } });

        if (!user) {
            return res.status(401).json({
                message: 'Not authorized :('
            });
        }

        await prisma.product.update({
            where: {
                id
            },
            data: {
                name,
                description,
                price,
            }
        });

        return res.status(200).json({
            message: 'Product updated'
        });
    } catch (e) {
        return res.status(400).json({
            message: 'Bad Request :(',
        });
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({
                message: 'Not authorized :('
            });
        }

        const token = authorization.replace('Bearer', '').trim();

        const data = jwt.verify(token, 'secret');

        const { id: tokenId } = data as TokenPaylod;

        const user = await prisma.user.findUnique({ where: { id: Number(tokenId) } });

        if (!user) {
            return res.status(401).json({
                message: 'Not authorized :('
            });
        }

        await prisma.product.delete({
            where: { id }
        });

        return res.status(200).json({
            message: 'Product deleted'
        });
    } catch (e) {
        return res.status(400).json({
            message: 'Bad Request :(',
        });
    }
}
