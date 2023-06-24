import express, {json} from 'express';
import {createReadStream} from 'fs';
const app = new express();
app.set('trust proxy', true);
app.use(json());
app.get('/', (req, res, next)=> {
    let ipNumber;
    let ipFormat;
    let ipCountry;
    if(req.body.ipAdress) {
        ipFormat = req.body.ipAdress;
        ipNumber = transformIpToIpNumber(req.body.ipAdress);
    } else { //For ngrok
        ipFormat = req.headers['x-forwarded-for'];
        ipNumber = transformIpToIpNumber(ipFormat);
    }
    const fileStream = createReadStream('IP2LOCATION-LITE-DB1.CSV', {encoding: 'utf8'});
    let prevChunk;
    fileStream.on('data', chunk => {
        let arrChunk = chunk.split('\r\n');
        if(prevChunk !== undefined) { //Concat last element to new one
            arrChunk[0] = prevChunk + arrChunk[0];
        }
        arrChunk =  arrChunk.map((el)=> {
            return el.split(',');
        });
        const lastEl = arrChunk.slice(-2, -1); //Second last element
        prevChunk = arrChunk.slice(-1); //Last element for concat to next
        if(Number(lastEl[0][0].slice(1, -1)) >= Number(ipNumber)) {
            fileStream.destroy(); //End read stream
            ipCountry = findCountry(arrChunk, ipNumber);
            console.log(`${ipCountry[3]} - ${ipFormat}`);
            res.send(` ${ipCountry[3]} - ${ipFormat}`);
        }
    });

});
app.listen(3000, ()=> {
    console.log('Server started');
});

function findCountry(arrChunk, ipNumber) { //Find country in chunk
    for(let i = 0; i < arrChunk.length; i++) {
        if(ipNumber < Number(arrChunk[i][0].slice(1, -1))) {
            return arrChunk[i-1];
        }
    }
}

function transformIpToIpNumber(ip) {//Transform IPv4 to IP number
    const ipArr = ip.split('.');
    return 16777216*Number(ipArr[0]) + 65536*Number(ipArr[1]) + 256*Number(ipArr[2]) + Number(ipArr[3]);
}