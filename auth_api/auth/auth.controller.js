import {Router} from "express";
import {AuthService} from "./auth.service.js";
import {UserService} from "../user/user.service.js";
export class AuthController {
    static authService = new AuthService();
    static userService = new UserService();
    constructor() {
        this.router = Router();
        this.router.post('/sign-in',this.validateData, this.login);
        this.router.post('/sign-up',this.validateData, this.register);
    }
    async register(req, res, next) {
        const {email, password} = req.body;
        if(await AuthController.userService.isUserExist(email)) {
            return res.status(409).send({
                success: false,
                error: 'This email already exists'
            });
        }
        const newUser = await AuthController.userService.createUser(email, password);
        res.status(201).send({
            success: true,
            data: {
                id: await AuthController.userService.findIdByEmail(email),
                accessToken: newUser.accessToken,
                refreshToken: newUser.refreshToken,
            }
        });
    }

    async login(req, res, next) {
        const {email, password} = req.body;
        if(!await AuthController.userService.isUserExist(email)) {
            return res.status(404).send({
                success: false,
                error: 'This user not found'
            });
        }
        const validUser = await AuthController.authService.validateUser(email, password)
        if(!validUser.passCheck) {
            return res.status(404).send({
                success: false,
                error: 'Bad password'
            });
        }
        const newTokens = await AuthController.authService.updateRefreshToken(email);
        res.status(200).send({
            success: true,
            data: {
                id: validUser.id,
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
            }
        });
    }

    validateData(req, res, next) {
        if(req.body.email && req.body.password) {
            next();
        } else {
            return res.status(502).send({
                success: false,
                error: 'Invalid request'
            });
        }
    }



}