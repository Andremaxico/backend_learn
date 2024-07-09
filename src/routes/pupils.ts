import express, { Express, Response, Request, NextFunction } from "express";
import { InputPupilModel } from "../models/InputPupilModel";
import { PupilViewModel } from "../models/PupilViewModel";
import { QueryPupilModel } from "../models/QueryPupilModel";
import { URIParamIdModel } from "../models/URIParamIdModel";
import { PupilType, RequestWithQuery, RequestWithBody, DBType } from "../types";
import { HTTP_STATUSES } from "../constants";
import { pupilsService } from "../domain/pupils-service";
import { bodyNameValidation, queryNameValidation, uriIdValidation } from "../middlewares/pupils";
import { body, validationResult } from "express-validator";
import { validationMiddleware } from "../utils/middlewares/validationMiddleware";

const getPupilViewModel = (dbPupil: PupilType): PupilViewModel => {
    return ({
        id: dbPupil.id,
        name: dbPupil.name
    })
}

export const pupilsRouter = express.Router();

pupilsRouter.get('/', async (
    req: RequestWithQuery<QueryPupilModel>, 
    res: Response<PupilViewModel[]>
) => {
    const foundPupils = await pupilsService.findPupilsByName(req.query.name || null);

    res.json(foundPupils.map(getPupilViewModel));
})

pupilsRouter.post(
    '/', 
    bodyNameValidation,
    validationMiddleware,
    async (
    req: RequestWithBody<InputPupilModel>, 
    res: Response<PupilViewModel>
) => {
    const createdPupil = await pupilsService.createPupil(req.body.name);

    res.status(HTTP_STATUSES.CREATED).json(getPupilViewModel(createdPupil));
});

pupilsRouter.delete(
    '/:id', 
    uriIdValidation,
    validationMiddleware,
    async (req: Request<URIParamIdModel>, res: Response) => {
        const isDeleted = await pupilsService.removePupil(req.params.id);

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
    body('name').trim().notEmpty(),
    validationMiddleware,
    async (
        req: Request<URIParamIdModel, InputPupilModel>, 
        res: Response<PupilViewModel>
    ) => {
        const isUpdated = await pupilsService.updatePupil(req.params.id, req.body.name);
        const newPupil = await pupilsService.findPupilById(req.params.id);

        console.log(isUpdated, newPupil, req.params.id);

        if(!isUpdated || !newPupil) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND);
            return;
        }

        res.status(HTTP_STATUSES.CREATED).json(getPupilViewModel(newPupil));
    }
)

//__test__
pupilsRouter.delete('/', async (req, res) => {
    const isRemoved = await pupilsService.removeAllPupils();

    if(isRemoved) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    }
});