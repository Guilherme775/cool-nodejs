require('dotenv').config();
import express from "express";
import cors from "cors";
import routes from './routes';
import { numberCron } from './crons/index';
import { mailQueue } from './lib/queue';
import { RegisterMail } from './jobs/RegisterMail';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

const serverAdapter = new ExpressAdapter();

createBullBoard({
    queues: [
        new BullAdapter(mailQueue),
    ],
    serverAdapter
});

const app = express();

serverAdapter.setBasePath('/admin/queues');
app.use('/admin/queues', serverAdapter.getRouter());

app.use(cors());
app.use(express.json());
app.use(routes);

numberCron;
mailQueue.process(RegisterMail.handle);

app.listen(process.env.PORT, () => {
    console.log(`Server running at ${process.env.PORT}`)
});
