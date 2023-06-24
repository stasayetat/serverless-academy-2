import express, {json} from 'express';
import {config} from "dotenv";
import { PrismaClient } from '@prisma/client'
import {UrlController} from "./url/url.controller";
config();
const PORT = process.env['PORT'];
const app = express();
export const client = new PrismaClient();

(async function(): Promise<void> {
    await client.$connect();
    app.use(json());
    app.use('/', new UrlController().router);
    app.listen(PORT, ()=> {
        console.log(`Server started on ${PORT}`);
    });
})();
