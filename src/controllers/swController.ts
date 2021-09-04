import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { get, set } from '../lib/redis';

const prisma = new PrismaClient();

export const getSwCharacter = async (_req: Request, res: Response) => {
    try {
        const cached = await get('sw');

        if (cached) {
            return res.status(200).json({
                data: cached
            });
        }

        const number = await prisma.number.findUnique({ where: { id: 1 } });

        const character = await axios.get(`https://swapi.dev/api/people/${number?.value}`);

        await set('sw', character.data, 60 * 15);

        return res.status(200).json({
            data: character.data
        });
    } catch (e) {
        return res.status(400).json({
            message: 'Bad Request :(',
        });
    }
}
