import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import validator from 'express-validator';

import routes from './routes';

dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());

app.use(express.static(path.resolve(`${__dirname}./../public`)));

routes(router);
app.use('/v1', router);

app.get('/', (req, res) => {
  res.status(200).render('index.html');
});

app.get('*', (req, res) => {
  res.redirect(302, '/');
});

app.listen(process.env.PORT || '4200');

export default app;
