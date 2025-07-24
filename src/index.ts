import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/db';
import { serverConfig } from './config/server.config';

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Adarsh API version 0.1');
});

app.listen(serverConfig.port, () => {
  console.log('https://localhost:' + serverConfig.port);
});
