import Queue from "bull";
import { RegisterMail } from '../jobs/RegisterMail';

export const mailQueue = new Queue(RegisterMail.key, { redis: { host: "localhost", port: 6379 } });

mailQueue.on('failed', (job, err) => {
    console.log('RegisterMail Job failed', job.data);
    console.log('error:', err);
});

mailQueue.on('completed', (job) => {
    console.log('RegisterMail Job completed', job.data);
});
