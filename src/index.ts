import express, { Request, Response } from 'express';
import { RequestWithBody, RequestWithQuery } from './types';
import { InputPupilModel } from './models/InputPupilModel';
import { QueryPupilModel } from './models/QueryPupilModel';
import { URIParamIdModel } from './models/URIParamIdModel';
import { PupilViewModel } from './models/PupilViewModel';

export const app = express();

const reqBodyMiddleware = express.json();
app.use(reqBodyMiddleware);

const port = 3030;

export const HTTP_STATUSES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,

    NOT_FOUND: 404,
    BAD_REQUEST: 400,
}

// const DBType = {
//     PupilTypes: [
//         {id: 1, name: 'Andrii'},
//         {id: 2, name: 'Sasha'},
//         {id: 3, name: 'Dmytro'},
//         {id: 4, name: 'Vadym'},
//     ]
// }

export type PupilType = {
    name: string, 
    id: number,
    positive: boolean,
}

type DBType = {
    pupils: PupilType[],
}

const db: DBType = {
    pupils: [],
}

const getPupilViewModel = (dbPupil: PupilType): PupilViewModel => {
    return ({
        id: dbPupil.id,
        name: dbPupil.name
    })
}

app.get('/pupils', (
    req: RequestWithQuery<QueryPupilModel>, 
    res: Response<PupilViewModel[]>
) => {
    let foundPupils = db.pupils;

    if(req.query.name && foundPupils.length > 0) {
        foundPupils = foundPupils.filter(PupilType => PupilType.name.indexOf(req.query.name) > -1)
    }

    res.json(foundPupils.map(getPupilViewModel));
})

app.post('/pupils', (
    req: RequestWithBody<InputPupilModel>, 
    res: Response<PupilViewModel>
) => {
    if(!req.body.name || req.body.name.trim().length < 1){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST);
        return;
    }

    console.log(req.body.name);

    const newPupil: PupilType = {
        id: db.pupils.length+1,
        name: req.body.name,
        positive: true,
    }

    db.pupils.push(newPupil);

    res.status(HTTP_STATUSES.CREATED).json(getPupilViewModel(newPupil));
})
app.delete('/pupils/:id', (req: Request<URIParamIdModel>, res) => {
    if(!req.params.id) {
        res.sendStatus(400);
        return;
    }

    const beforeDelLength = db.pupils.length;

    db.pupils = db.pupils.filter(PupilType => PupilType.id !== +req.params.id);

    if(db.pupils.length === beforeDelLength) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
});

app.put('/pupils/:id', (
    req: Request<URIParamIdModel, InputPupilModel>, 
    res: Response<PupilViewModel>
) => {
    if(!req.params.id || !req.body.name || req.body.name.trim().length < 1){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST);
        return;
    }

    const changedPupilType = db.pupils.find(PupilType => PupilType.id === +req.params.id);

    if(!changedPupilType) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }

    const changedIdx = db.pupils.indexOf(changedPupilType);
    const newPupil: PupilType = {
        id: changedIdx,
        name: req.body.name,
        positive: true,
    }

    db.pupils[changedIdx] = {...newPupil};

    res.status(HTTP_STATUSES.CREATED).json(getPupilViewModel(newPupil));
})

app.delete('/pupils', (req, res) => {
    db.pupils = [];

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
})

app.listen(port, () => {
    console.log('Example app listening on port ', port);
})