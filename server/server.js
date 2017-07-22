import dotenv from 'dotenv';
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());

app.use('/v1/users', users);
app.use('/v1/search', search);
app.use('/v1/documents', authenticate, documents);

app.listen(process.env.PORT || '4200');

export default app;
