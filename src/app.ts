import express, { Response, Request, NextFunction } from 'express';
import { db } from './db';
import { pupilsRouter } from './routes/pupils';
import { getSchoolsRouter } from './routes/schools';
import { validationResult } from 'express-validator';
import { HTTP_STATUSES } from './constants';
import { MongoClient } from 'mongodb';
import e from 'express';
import { usersRouter } from './routes/users';

export const app = express();

const reqBodyMiddleware = express.json();

// const reqCountMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     console.log('request++');
//     db.requestsCount++;
//     next();
// }

app.use(reqBodyMiddleware);
//app.use(reqCountMiddleware);

//app.use('/schools', getSchoolsRouter(db));
app.use('/pupils', pupilsRouter);
app.use('/users', usersRouter);

