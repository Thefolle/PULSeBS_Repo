const express = require('express');
const request = require("supertest");
const pulsebsDAO = require('../pulsebsDAO');
const server = require("../server");
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 900; //seconds

// Authorization error
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };

//Initializing server
const app = express();
const port = 3001;

app.use("/", server);


let token;
let session;


beforeAll((done) => {

    const authdata = {
        email: 'davide.calarco@gmail.com', 
        password: 'password' 
      };

       const response = request(app)
      .post('/api/login')
      .send({email: 'davide.calarco@gmail.com', password: 'password'})
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
        .send({lectureId: lectureId})
        .then((res) => {
           expect(res.status).toBe(201);
           expect(res.body.response).toBe(1);
        });
  });
  
});


//GET STUDENT LECTURES

describe('get /api/student/lectures', () => {
    it('should return a 200 if exists', async () => {
       
      const studentLecturesExpected = [
            {
                "active": 1,
                "bookable": 1,
                "date": 1635452400000,
                "Cdesc": "Analisi 1",
                "CLdesc": "12",
                "id": 1,
                "name": "Hyeronimus",
                "presence": 1,
                "surname": "Bosch"
            },
            {
                "active": 0,
                "bookable": 0,
                "date": 1605547800000,
                "Cdesc": "Analisi 1",
                "CLdesc": "10",
                "id": 2,
                "name": "Hyeronimus",
                "presence": 0,
                "surname": "Bosch"
            },
            {
                "active": 1,
                "bookable": 1,
                "date": 1606057200000,
                "Cdesc": "Analisi 1",
                "CLdesc": "12",
                "id": 3,
                "name": "Hyeronimus",
                "presence": 1,
                "surname": "Bosch"
            },
            {
                "active": 1,
                "bookable": 1,
                "date": 1606152600000,
                "Cdesc": "Analisi 1",
                "CLdesc": "10",
                "id": 4,
                "name": "Hyeronimus",
                "presence": 1,
                "surname": "Bosch"
            }
        ]
    
      const response = await request(app)
                .get('/api/student/lectures')
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(200);
      expect(response.body).toEqual( studentLecturesExpected );
    });

});
  


//GET ALL STUDENT'S BOOKINGS
describe('get /api/student/bookings', () => {
    it('should return a 200 if exists', async () => {
   
      const studentBookingsExpected = [
    {
        "active": 0,
        "date": 1605022961000,
        "id": 1,
        "presence": 0,
        "ref_lecture": 1,
        "ref_student": 269901
    },
    {
        "active": 1,
        "date": 1605538865653,
        "id": 2,
        "presence": 0,
        "ref_lecture": 1,
        "ref_student": 269901
    },
    {
        "active": 1,
        "date": 1605024581392,
        "id": 3,
        "presence": 0,
        "ref_lecture": 2,
        "ref_student": 269901
    },
    {
        "active": 1,
        "date": 1605026289824,
        "id": 4,
        "presence": 0,
        "ref_lecture": 4,
        "ref_student": 269901
    }
]

const response = await request(app)
        .get('/api/student/bookings')
        .set('Cookie', `token=${token}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
expect(response.status).toBe(200);
expect(response.body).toEqual( studentBookingsExpected );
 });
});


//app.listen(port, () => console.log(`REST API server listening at http://localhost:${port}`));
