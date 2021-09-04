import nodemailer from 'nodemailer';

export const mail = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "5d1eedceb0ae0b",
        pass: "667f25f76bf833"
    }
});
