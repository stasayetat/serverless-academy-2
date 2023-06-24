import express, {json} from 'express';
import {readFile, writeFile} from 'fs/promises';
const app = express();
app.use(json());

app.put('/:table/:name', async (req, res, next)=> {
    try {
        const jsonString = await readFile(`./databases/${req.params.table}.json`, {encoding: 'utf8'});
        const database = JSON.parse(jsonString);
        database[`${req.params.name}`] = req.body[`${req.params.name}`];
        await writeFile(`./databases/${req.params.table}.json`, JSON.stringify(database));
    } catch (err) {
        await writeFile(`./databases/${req.params.table}.json`, JSON.stringify(req.body));
    } finally {
        res.status(200).json(req.body);
    }


});

app.get('/:table/:name', async (req, res, next)=> {
    try {
        const jsonString = await readFile(`./databases/${req.params.table}.json`, {encoding: 'utf8'});
        const database = JSON.parse(jsonString);
        const value = {};
        value[`${req.params.name}`] = database[`${req.params.name}`];
        if(database[`${req.params.name}`] !== undefined) {
            res.json(value);
        } else {
            res.status(404).send('Value not found');
        }
    } catch (err) {
        res.status(404).send('File not found');
    }
})

app.listen(3000, ()=> {
    console.log('Server started');
});