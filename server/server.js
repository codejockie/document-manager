import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import validator from 'express-validator';

import users from './routes/users';
import search from './routes/search';
import documents from './routes/documents';
import { authenticate } from './helpers/middleware';

dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const app = express();

app.use(express.static(path.resolve(`${__dirname}./../public`)));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());


app.use('/v1/users', users);
app.use('/v1/search', search);
app.use('/v1/documents', authenticate, documents);

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('/v1', (req, res) => {
  res.redirect(302, '/');
});

app.listen(process.env.PORT || '4200');

export default app;
