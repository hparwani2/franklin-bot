
import express from 'express';
import bodyParser from 'body-parser';
import { processFile } from './controller/botController.js';

const app = express();
app.use(bodyParser.json());
app.post('/franklin-bot/v1/processfile', processFile);

app.listen(8081, () => {
    console.log('app running on port 8081');
})