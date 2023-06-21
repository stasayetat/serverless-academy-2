import {Router} from "express";
import {UserService} from "./user.service.js";
import {verify} from "jsonwebtoken";

export class UserController {
    static userService = new UserService();

    constructor() {
        this.router = Router();
        this.router.get('/', this.validateToken, this.me);
    }

    async me(req, res, next) {
        const currentUser = await UserController.userService.findUser(req.email);
        res.status(200).send({
            success: true,
            data: {
                id: currentUser.id,
                email: currentUser.email
            }
        });
    }
    async validateToken(req, res, next) {
        if(req.headers.authorization) {
            verify(req.headers.authorization.split(' ')[1], process.env['SECRET'], (err, payload)=> {
                if(err) {
                    return res.status(404).send({
                        success: false,
                        error: 'Bad token'
                    });
                } else {
                    const infoPayload = payload;
                    req.email = infoPayload.email;
                    next();
                }
            });
        } else {
            return res.status(404).send({
                success: false,
                error: 'Token not found'
            });
        }
    }

}