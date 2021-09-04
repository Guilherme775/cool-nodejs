## Techs

- Node
- Express
- Postgress
- Prisma
- Redis (Cache)
- Nodemailer
- Background Jobs (Bull)
- Crons
- JWT

## Project

- /user - criar um usuário (enviar email em background job após o cadastro)
- /user/delete - deletar um usuário (autenticação jwt)
- /login - jwt
- /user/reset-password - alterar senha (validação com token jwt e envio de email)
- /user/products - pega todos os produtos de um usuário (autenticação jwt)
- /product - cadastrar produtos de um usuário (autenticação jwt)
- /product/update - alterar produtos de um usuário (autenticação jwt)
- /product/delete - deletar produtos de um usuário (autenticação jwt)
- /sw - star wars character of the day (cache using redis)
- cron que salva um número aleatorio no banco todo dia ;p
