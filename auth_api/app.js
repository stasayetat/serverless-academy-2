import express, {json} from 'express';
import {AuthController} from './auth/auth.controller.js';
import pg from "pg";
import {UserController} from "./user/user.controller.js";
const app = express();
export const client = await createDBConnect();
const authController = new AuthController();
const userController = new UserController();
app.use(json());
app.use('/auth', authController.router);
app.use('/me', userController.router);
app.listen(3000, ()=> {
    console.log('Server started');
});

async function createDBConnect() {
    return new pg.Pool({
        user: 'postgres',
        host: 'db.yrsnjxeqywjppxikline.supabase.co',
        database: 'postgres',
        password: 'B3yipiz-AfMg77_',
        port: '5432'
    });
}
