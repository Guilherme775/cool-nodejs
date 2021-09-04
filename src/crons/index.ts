import cron from "node-cron";
import { PrismaClient } from '@prisma/client';
import { getNumber } from '../utils/index';

const prisma = new PrismaClient();

// this runs every day at 12:00
export const numberCron = cron.schedule("00 00 12 * * 0-6", async () => {
    try {
        console.log("Number cron triggered");

        const number = await prisma.number.findUnique({ where: { id: 1 } });

        const value = getNumber(1, 84);

        if (!number) {
            console.log("Creating random number");

            await prisma.number.create({
                data: {
                    value
                }
            });

            return;
        }

        console.log("Updating random number");

        await prisma.number.update({
            where: { id: 1 },
            data: {
                value
            }
        });

        return;
    } catch (e) {
        console.log('error: ', e);
    }
});
