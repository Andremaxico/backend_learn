import request from "supertest";
import { InputPupilModel } from "../../src/models/InputPupilModel";
import { app } from "../../src/app";
import { PupilType } from "../../src/types";
import { HTTP_STATUSES } from "../../src/constants";

describe('all endpoints', () => {
    beforeAll( async () => {
        await request(app).delete('/pupils');
    })

    it('get request should return empty array and 200 status', async () => {
        await request(app)
            .get('/pupils')
            .expect(HTTP_STATUSES.OK, [])
    })

    it('should not add object to database with incorrect data', async () => {
        await request(app)
            .post('/pupils')
            .send({name: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST);
        
        //check that object is not added to DBType
        await request(app)
            .get('/pupils')
            .expect(HTTP_STATUSES.OK, [])
    });

    let createdUserData: null | PupilType = null;



    it('should return 201 status after adding', async () => {
        const data: InputPupilModel = {name: 'Solomon'};

        const response = await request(app)
            .post('/pupils')
            .send(data)
            .expect(HTTP_STATUSES.CREATED)

        createdUserData = response.body;

        expect(createdUserData).toEqual({
            name: data.name,
            id: expect.any(Number)
        });

        //check is post addded to DBType
        await request(app)
            .get('/pupils')
            .expect(HTTP_STATUSES.OK, [createdUserData])
    })  

    it('should not return single user with incorrect id-param', async () => {
        await request(app)
            .get(`/pupils/-111`)
            .expect(HTTP_STATUSES.NOT_FOUND);
    })

    let createdUser2Data: null | PupilType = null;
    it('should add another PupilType', async () => {
        const data: InputPupilModel = {name: 'Maria'};

        const response = await request(app)
            .post('/pupils')
            .send({name: 'Maria'})
            .expect(HTTP_STATUSES.CREATED)

        createdUser2Data = response.body;

        expect(createdUser2Data).toEqual({
            name: data.name,
            id: expect.any(Number)
        });

        //check is post addded to DBType
        await request(app)
            .get('/pupils')
            .expect(HTTP_STATUSES.OK, [createdUserData, createdUser2Data])
    })

    it('should delete second user', async () => {
        await request(app)
            .delete(`/pupils/${createdUser2Data?.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT)

        //check is deleted from DBType
        await request(app)
            .get('/pupils')
            .expect(HTTP_STATUSES.OK, [createdUserData]);
    })

    it('shout return 400 status with text id when deleting', async () => {
        await request(app)
            .delete('/pupils/ididi')
            .expect(HTTP_STATUSES.BAD_REQUEST);
    })

    it('should not delete not existing user', async () => {
        await request(app)
            .delete('/pupils/-111')
            .expect(HTTP_STATUSES.NOT_FOUND)
    })

    it('should update pupil', async () => {
        const data: InputPupilModel = {
            name: 'Solomon2222'
        };

        const response = await request(app)
            .put(`/pupils/${createdUserData?.id}`)
            .send(data);
        
        createdUserData = response.body;

        expect(createdUserData).toEqual({
            name: data.name,
            id: createdUserData?.id
        });

        //check is changed in DBType
        await request(app)
            .get('/pupils')
            .expect(HTTP_STATUSES.OK, [createdUserData]);
    })

    it('should not update pupil with incorrect data', async () => {
        const data: InputPupilModel = {
            name: ''
        };

        await request(app)
            .put(`/pupils/${createdUserData?.id}`)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST)

        //check is not changed in DBType
        await request(app)
            .get('/pupils')
            .expect(HTTP_STATUSES.OK, [createdUserData]);
    })

    it('should not update pupil with wrong id', async () => {
        const data: InputPupilModel = {
            name: 'Solomon22225'
        };

        await request(app)
            .put(`/pupils/-111`)
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUND)

        //check is not changed in DBType
        await request(app)
            .get('/pupils')
            .expect(HTTP_STATUSES.OK, [createdUserData]);
    })

    it('should delete all pupils', async () => {
        await request(app)
            .delete('/pupils')
            .expect(HTTP_STATUSES.NO_CONTENT);
            
        //check is deleted
        await request(app)
            .get('/pupils')
            .expect(HTTP_STATUSES.OK, [])
    })

    it('should return text when requesting all schools', async () => {
        await request(app)
            .get('/schools')
            .expect(HTTP_STATUSES.OK, '"[]"');
    })
})