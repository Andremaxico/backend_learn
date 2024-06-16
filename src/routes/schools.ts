import express, { Request, Response } from 'express';
import { DBType, RequestWithQuery } from "../types";
import { schoolsRepository } from '../repository/schools';

export const getSchoolsRouter = (db: DBType) => {
    const router = express.Router();

    router.get('/', (req: RequestWithQuery<{name: string | undefined}>, res: Response<string>) => {
        const books = schoolsRepository.findAllBooks(req.query.name || null);

        res.status(200).json(JSON.stringify(books));
    })

    router.get('/:id([0-9]+)]', (req: Request<{id: string}>, res: Response<string>) => {


        res.status(200).json('return school with id ' + req.params.id);
    });

    return router;
}