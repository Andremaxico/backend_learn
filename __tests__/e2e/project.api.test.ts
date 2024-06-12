import request from "supertest";
import { app, HTTP_STATUSES, Pupil }  from '../../src/index';

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
        
        //check that object is not added to db
        await request(app)
            .get('/pupils')
            .expect(HTTP_STATUSES.OK, [])
    });

    let createdUserData: null | Pupil = null;



    it('should return 201 status after adding', async () => {
        const response = await request(app)
            .post('/pupils')
            .send({name: 'Solomon'})
            .expect(HTTP_STATUSES.CREATED)

        createdUserData = response.body;

        expect(createdUserData).toEqual({
            name: 'Solomon',
            id: expect.any(Number)
        });

        //check is post addded to db
        await request(app)
            .get('/pupils')
            .expect(HTTP_STATUSES.OK, [createdUserData])
    })  

    it('should not return single user with incorrect id-param', async () => {
        await request(app)
            .get(`/pupils/-111`)
            .expect(HTTP_STATUSES.NOT_FOUND);
    })

    let createdUser2Data: null | Pupil = null;
    it('should add another pupil', async () => {
        const response = await request(app)
            .post('/pupils')
            .send({name: 'Maria'})
            .expect(HTTP_STATUSES.CREATED)

        createdUser2Data = response.body;

        expect(createdUser2Data).toEqual({
            name: 'Maria',
            id: expect.any(Number)
        });

        //check is post addded to db
        await request(app)
            .get('/pupils')
            .expect(HTTP_STATUSES.OK, [createdUserData, createdUser2Data])
    })

    it('should delete second user', async () => {
        await request(app)
            .delete(`/pupils/${createdUser2Data?.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT)

        //check is deleted from db
        await request(app)
            .get('/pupils')
            .expect(HTTP_STATUSES.OK, [createdUserData]);
    })

    it('should not delete not existing user', async () => {
        await request(app)
            .delete('/pupils/-111')
            .expect(HTTP_STATUSES.NOT_FOUND)
    })

    it('should update pupil', async () => {
        const response = await request(app)
            .put(`/pupils/${createdUserData?.id}`)
            .send({
                id: createdUserData?.id,
                name: 'Solomon2222'
            });
        
        createdUserData = response.body;

        expect(createdUserData).toEqual({
            name: 'Solomon2222',
            id: createdUserData?.id
        });

        //check is changed in db
        await request(app)
            .get('/pupils')
            .expect(HTTP_STATUSES.OK, [createdUserData]);
    })

    it('should not update pupil with incorrect data', async () => {
        await request(app)
            .put(`/pupils/${createdUserData?.id}`)
            .send({
                id: createdUserData?.id,
                name: ''
            })
            .expect(HTTP_STATUSES.BAD_REQUEST)

        //check is not changed in db
        await request(app)
            .get('/pupils')
            .expect(HTTP_STATUSES.OK, [createdUserData]);
    })

    it('should not update pupil with wrong id', async () => {
        await request(app)
            .put(`/pupils/-111`)
            .send({
                id: createdUserData?.id,
                name: 'Solomon2222'
            })
            .expect(HTTP_STATUSES.NOT_FOUND)

        //check is not changed in db
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
})