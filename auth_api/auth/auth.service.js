import pg from "pg";
import pkg, {verify} from 'jsonwebtoken';
import {compare, hash} from "bcrypt";
import { client } from "../app.js";
const {sign} = pkg;


export class AuthService {

    async updateRefreshToken(email) {
        const refreshToken = await this.createRefreshJWT(email);
        const res = await client.query(`UPDATE users SET refresh_token='${refreshToken}' WHERE email='${email}'`);
        return {
            accessToken: await this.createJWT(email),
            refreshToken
        };
    }

    async validateUser(email, password) {
        const res = await client.query(`SELECT id, email, password FROM users WHERE email='${email}'`);
        return {
            id: res.rows[0].id,
            passCheck: await compare(password, res.rows[0].password)
        };
    }

    async createJWT(email) {
        return await sign(
            {
                email,
            },
            process.env['SECRET'],
            {
                algorithm: 'HS256',
                expiresIn: process.env['TTL']
            }
            );
    }

    async createRefreshJWT(email) {
        return await sign(
            {
                email,
            },
            process.env['SECRET'],
            {
                algorithm: 'HS256',
            }
        );
    }

}