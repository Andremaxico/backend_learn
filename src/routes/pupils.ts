import express, { Express, Response, Request, NextFunction } from "express";
import { InputPupilModel } from "../models/InputPupilModel";
import { PupilViewModel } from "../models/PupilViewModel";
import { QueryPupilModel } from "../models/QueryPupilModel";
import { URIParamIdModel } from "../models/URIParamIdModel";
import { PupilType, RequestWithQuery, RequestWithBody, DBType } from "../types";
import { HTTP_STATUSES } from "../constants";
import { pupilsRepository } from "../repository/pupils";
import { queryNameValidation, uriIdValidation, validationMiddleware } from "../middlewares.ts/pupils";
import { validationResult } from "express-validator";

const getPupilViewModel = (dbPupil: PupilType): PupilViewModel => {
    return ({
        id: dbPupil.id,
        name: dbPupil.name
    })
}

export const pupilsRouter = express.Router();

pupilsRouter.get('/', (
    req: RequestWithQuery<QueryPupilModel>, 
    res: Response<PupilViewModel[]>
) => {
    const foundPupils = pupilsRepository.findPupilsByName(req.query.name || null);

    res.json(foundPupils.map(getPupilViewModel));
})

pupilsRouter.post('/', (
    req: RequestWithBody<InputPupilModel>, 
    res: Response<PupilViewModel>
) => {
    if(!req.body.name || req.body.name.trim().length < 1){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST);
        return;
    }

    const createdPupil = pupilsRepository.createPupil(req.body.name);

    res.status(HTTP_STATUSES.CREATED).json(getPupilViewModel(createdPupil));
});

pupilsRouter.delete(
    '/:id', 
    uriIdValidation,
    validationMiddleware,
    (req: Request<URIParamIdModel>, res) => {
        const isDeleted = pupilsRepository.removePupil(Number(req.params.id));

        console.log('is deleted', isDeleted);

        if(!isDeleted) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND);
            return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    }
);

pupilsRouter.put(
    '/:id', 
    uriIdValidation,
    validationMiddleware,
    (
        req: Request<URIParamIdModel, InputPupilModel>, 
        res: Response<PupilViewModel>
    ) => {
        if(!req.params.id || !req.body.name || req.body.name.trim().length < 1){
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST);
            return;
        }

        const isUpdated = pupilsRepository.updatePupil(Number(req.params.id), req.body.name);
        const newPupil = pupilsRepository.findPupilById(Number(req.params.id));

        console.log(isUpdated, newPupil, req.params.id);

        if(!isUpdated || !newPupil) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND);
            return;
        }

        res.status(HTTP_STATUSES.CREATED).json(getPupilViewModel(newPupil));
    }
)

//__test__
pupilsRouter.delete('/', (req, res) => {
    const isRemoved = pupilsRepository.removeAllPupils();

    if(isRemoved) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    }
})