import express from "express";

import { create, deleteUser, login, resetPassword } from './controllers/userController';
import { createProduct, getProducts, updateProduct, deleteProduct } from './controllers/productController';
import { getSwCharacter } from './controllers/swController';
import authMiddleware from "./middlewares/authMiddleware";

const routes = express.Router();

routes.get('/', (_req, res) => {
    return res.json({
        cria: "projeto dos cria"
    });
})

routes.post('/user', create);
routes.delete('/user/delete', authMiddleware, deleteUser);
routes.post('/login', login);
routes.post('/user/reset-password', authMiddleware, resetPassword);
routes.get('/user/products', getProducts);
routes.post('/product', createProduct);
routes.post('/product/update', updateProduct);
routes.delete('/product/delete', deleteProduct);
routes.get('/sw', getSwCharacter);

export default routes;
