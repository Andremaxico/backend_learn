import express, { Response, Request, NextFunction } from 'express';
import { db } from './db';
import { pupilsRouter } from './routes/pupils';
import { getSchoolsRouter } from './routes/schools';

export const app = express();

const reqBodyMiddleware = express.json();
const reqCountMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log('request++');
    db.requestsCount++;
    next();
}
app.use(reqBodyMiddleware);
app.use(reqCountMiddleware);

app.use('/schools', getSchoolsRouter(db));
app.use('/pupils', pupilsRouter);

