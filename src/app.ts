// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import lessonsRouter from './routes/lessons';
import { setupSwagger } from './swagger';

dotenv.config();

const app = express();

app.use(express.json());

app.use(morgan('combined'));

app.use('/lessons', lessonsRouter);

setupSwagger(app);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
