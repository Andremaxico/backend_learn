import express from 'express';

const app = express();

const reqBodyMiddleware = express.json();
app.use(reqBodyMiddleware);

const port = 3030;

const httpStatuses = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,

    NOT_FOUND: 404,
    BAD_REQUEST: 400,
}

const db = {
    pupils: [
        {id: 1, name: 'Andrii'},
        {id: 2, name: 'Sasha'},
        {id: 3, name: 'Dmytro'},
        {id: 4, name: 'Vadym'},
    ]
}

app.get('/pupils', (req, res) => {
    let foundPupils = db.pupils;

    if(req.query.name) {
        foundPupils = foundPupils.filter(pupil => pupil.name.indexOf(req.query.name as string) > -1)
    }

    res.json(foundPupils);
})

app.post('/pupils', (req, res) => {
    if(!req.body.name || req.body.name.trim().length < 1){
        res.sendStatus(httpStatuses.BAD_REQUEST);
        return;
    }

    console.log(req.body.name);

    const newPupil = {
        id: db.pupils.length+1,
        name: req.body.name
    }

    db.pupils.push(newPupil);

    res.status(httpStatuses.CREATED).json(newPupil);
})
app.delete('/pupils/:id', (req, res) => {
    if(!req.params.id) {
        res.sendStatus(400);
        return;
    }

    const beforeDelLength = db.pupils.length;

    db.pupils = db.pupils.filter(pupil => pupil.id !== +req.params.id);

    if(db.pupils.length === beforeDelLength) {
        res.sendStatus(httpStatuses.NOT_FOUND);
        return;
    }

    res.sendStatus(httpStatuses.NO_CONTENT);
});

app.put('/pupils/:id', (req, res) => {
    if(!req.params.id || !req.body.name || req.body.name.trim().length < 1){
        res.sendStatus(httpStatuses.BAD_REQUEST);
        return;
    }

    const changedPupil = db.pupils.find(pupil => pupil.id === +req.params.id);

    if(!changedPupil) {
        res.sendStatus(httpStatuses.NOT_FOUND);
        return;
    }

    const changedIdx = db.pupils.indexOf(changedPupil);
    const newPupil = {
        id: changedIdx,
        name: req.body.name,
    }

    db.pupils[changedIdx] = {...newPupil}; 
    console.log(req.body.name);

    res.status(httpStatuses.CREATED).json(newPupil);
})

app.listen(port, () => {
    console.log('Example app listening on port ', port);
})