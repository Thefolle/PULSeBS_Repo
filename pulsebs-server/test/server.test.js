const express = require('express');
const request = require("supertest");
const {server, handleToCloseServer} = require("../server");
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const supertest = require('supertest');

const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 900; //seconds

// Authorization error
const authErrorObj = { errors: [{ 'param': 'Server', 'message': 'Authorization error' }] };

//Initializing server
// const app = express();
const port = 3001;

// server2 = app.listen(port, () => console.log(`REST API server listening at http://localhost:${port}`));

let token;
let session;

beforeAll((done) => {

    const authdata = {
        email: 'davide.calarco@gmail.com',
        password: 'password'
    };

    const response = request(server)
        .post('/api/login')
        .send({ email: 'davide.calarco@gmail.com', password: 'password' })
        .end((err, response) => {
            token = response.body.token;
            done();
        });
});


//POST BOOK A SEAT

describe('post /api/student/booking', () => {
    it('POST should return a 1', async () => {
        const lectureId = 2;

        await request(app)
            .post('/api/student/booking')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({ lectureId: lectureId })
            .then((res) => {
                expect(res.status).toBe(201);
                expect(res.body.response).toBe(1);
            });
    });

});


//GET STUDENT LECTURES

describe('get /api/student/lectures', () => {
    it('should return a 200 if exists', async () => {

        const response = await request(app)
            .get('/api/student/lectures')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(4);
    });

});


//GET ALL STUDENT'S BOOKINGS
describe('get /api/student/bookings', () => {
    it('should return a 200 if exists', async () => {

        const response = await request(app)
            .get('/api/student/bookings')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(3);
    });
});

describe('E2E testing/Integration testing', () => {
    test('Turnable lecture', function (done) {
        let teacherId = 1; // not really needed
        let lectureId = 1;
        request(server)
            .put('/api/teachers/' + teacherId + '/lectures/' + lectureId)
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({ presence: 0 })
            .end(function (error, response) {
                if (error) return done(error);
                expect(response.status).toBe(204);
                done();
            });
        // console.log("Response body message: ");
        // console.log(response.body.message);
        // expect(response.status).toBe(204);
        // let teacherId = 1; // not really needed
        // let lectureId = 1;
        // const response = await request(app)
        //     .put('/api/teachers/' + teacherId + '/lectures/' + lectureId)
        //     .set('Cookie', `token=${token}`)
        //     .set('Content-Type', 'application/json')
        //     .send({ presence: 0 });
        // console.log("Response body message: ");
        // console.log(response.body.message);
        // expect(response.status).toBe(204);
            // .then(response => {
            //     let toBe = 204;
            //     if (response.status != toBe) {
            //         console.log("Test failure message: ");
            //         console.log(response.type);
            //     }
            //     expect(response.status).toBe(toBe);
            // }).catch(NonHTTPErr => {
            //     console.log("Test failure message: ");
            //     console.log(NonHTTPErr);
            // });
    });
});

afterAll((done) => {
    handleToCloseServer.close();
    done();
})



