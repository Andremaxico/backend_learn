import express, { Express, Response, Request, NextFunction } from "express";
import { InputPupilModel } from "../models/InputPupilModel";
import { PupilViewModel } from "../models/PupilViewModel";
import { QueryPupilModel } from "../models/QueryPupilModel";
import { URIParamIdModel } from "../models/URIParamIdModel";
import { PupilType, RequestWithQuery, RequestWithBody, DBType } from "../types";
import { HTTP_STATUSES } from "../constants";
import { pupilsService } from "../domain/pupils-service";
import { queryNameValidation, uriIdValidation } from "../middlewares.ts/pupils";
import { validationResult } from "express-validator";
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

pupilsRouter.post('/', async (
    req: RequestWithBody<InputPupilModel>, 
    res: Response<PupilViewModel>
) => {
    if(!req.body.name || req.body.name.trim().length < 1){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST);
        return;
    }

    const createdPupil = await pupilsService.createPupil(req.body.name);

    res.status(HTTP_STATUSES.CREATED).json(getPupilViewModel(createdPupil));
});

pupilsRouter.delete(
    '/:id', 
    uriIdValidation,
    validationMiddleware,
    async (req: Request<URIParamIdModel>, res) => {
        const isDeleted = await pupilsService.removePupil(Number(req.params.id));

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
    async (
        req: Request<URIParamIdModel, InputPupilModel>, 
        res: Response<PupilViewModel>
    ) => {
        if(!req.params.id || !req.body.name || req.body.name.trim().length < 1){
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST);
            return;
        }

        const isUpdated = await pupilsService.updatePupil(Number(req.params.id), req.body.name);
        const newPupil = await pupilsService.findPupilById(Number(req.params.id));

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
})