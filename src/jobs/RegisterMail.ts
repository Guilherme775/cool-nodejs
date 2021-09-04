import { mail } from '../lib/mail';

type Data = {
    name: string,
    email: string
}

type HandleParams = {
    data: Data
}

export const RegisterMail = {
    key: 'RegisterMail',
    async handle({ data }: HandleParams) {
        const { name, email } = data;

        await mail.sendMail({
            from: 'Test <test@test.com>',
            to: `${name} <${email}>`,
            subject: 'Cadastro',
            html: `Olá, ${name}, bem-vindo :D`
        });
    }
}