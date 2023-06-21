import {client} from "../app.js";
import {hash} from "bcrypt";
import {AuthService} from "../auth/auth.service.js";

export class UserService {
    static authService = new AuthService();
    async findUser(email) {
        const res = await client.query(`SELECT id, email FROM users WHERE email='${email}'`);
        return {
            id: res.rows[0].id,
            email: res.rows[0].email
        }
    }

    async createUser(email, password) {
        const refreshToken = await UserService.authService.createRefreshJWT(email);
        const res = await client.query(`INSERT INTO users(id, email, password, refresh_token) VALUES (uuid_generate_v4(), '${email}', '${await hash(password, Number(process.env['SALT']))}', '${refreshToken}')`);
        const accessToken = await UserService.authService.createJWT(email);
        return {
            refreshToken,
            accessToken
        };
    }

    async isUserExist(email) {
        const res = await client.query(`SELECT EXISTS(SELECT 1 FROM users WHERE email='${email}')`);
        return res.rows[0].exists;
    }

    async findIdByEmail(email) {
        const res = await client.query(`SELECT id FROM users WHERE email='${email}'`);
        return res.rows[0].id;
    }
}