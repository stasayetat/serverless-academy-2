import {createHash } from 'crypto';
import {client} from "../index";
export class UrlService {
    async create(url: string): Promise<string> {
        let tableLength = await client.urlModel.count();
        let hashCount = Number(process.env['HASHCOUNT']);
        if(tableLength >= 16**hashCount) {
            console.log('Too many values, Maybe problems with generate, increase HASHCOUNT');
            hashCount += 1;
        }
        const shortURL = createHash('shake256', {outputLength: hashCount})
                .update(url)
                .digest('hex');
        await client.urlModel.create({
            data: {
                longURL: url,
                shortURL: shortURL
            }
        });
        return `http://localhost:3000/${shortURL}`
    }

    async findLongURLByShortURL(url: string): Promise<string | undefined> {
        const foundURL = await client.urlModel.findFirst({
            where: {
                shortURL: url
            }
        });
        return foundURL?.longURL;
    }

    async findShortURLByLongURL(url: string): Promise<string | undefined> {
        const foundURL = await client.urlModel.findFirst({
            where: {
                longURL: url
            }
        });
        return `http://localhost:3000/${foundURL?.shortURL}`;
    }
}