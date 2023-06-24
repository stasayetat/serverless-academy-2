import {UrlService} from "./url.service";
import {NextFunction, Request, Response, Router} from "express";

export class UrlController {
    static urlService: UrlService = new UrlService();
    router: Router;
    constructor() {
        this.router = Router();
        this.router.post('/api/create', this.validateURL, this.create);
        this.router.get('/:hash', this.redirectFromShortURL);
    }

    async create(req: Request, res: Response, next: NextFunction) {
        const foundURL = await UrlController.urlService.findShortURLByLongURL(req.body.url);
        if(!foundURL?.includes('undefined')) {
            res.send(foundURL);
        } else {
            const shortURL = await UrlController.urlService.create(req.body.url);
            res.send(shortURL);
        }
    }

    async redirectFromShortURL(req: Request, res: Response, next: NextFunction) {
        const originURL = await UrlController.urlService.findLongURLByShortURL(req.params.hash);
        if(originURL !== undefined) {
            res.redirect(originURL);
        } else {
            res.status(404).send('Bad URL');
        }
    }

    validateURL(req: Request, res: Response, next: NextFunction) {
        try {
            new URL(req.body.url);
            return next();
        } catch (e) {
            return res.status(400).send('Bad URL');
        }
    }

}