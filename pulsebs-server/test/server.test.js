const express = require("express");
const morgan = require('morgan'); // logging middleware
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
//const serverRoutes = require("./server-routes");
const request = require("supertest");
//const [save] = require("./save_json");
const bodyParser = require("body-parser");

/*jest.mock("./save_json", () => ({
  save: jest.fn(),
}));*/

const app = express();
//app.use("/states", serverRoutes);
app.use(bodyParser.json());

// Set-up logging
app.use(morgan('tiny'));
// Process body content
app.use(express.json());

let token;

beforeEach((done) => {

    const authdata = {
        email: 'davide.calarco@gmail.com', 
        password: 'password' 
      };

     const response = request(app)
      .post('/api/login')
      .send({ email: authdata.email, password: authdata.password })
      .end((err, response) => {
        token = response.body.token;
        done();
      });
  });


//POST BOOK A SEAT

describe('post /api/student/booking', () => {
    it('POST should return a 1', async () => {
      const lectureId = 1;
  
      const response = await request(app).post('/api/student/booking')
        .send(lectureId);
  
      expect(response.body).toBe(1);
    });
  });
  



//GET STUDENT LECTURES

describe('get /api/student/lectures', () => {
    it('should return a 200 if exists', async () => {
       
      const studentLecturesExpected = [
            {
                "active": 1,
                "bookable": 1,
                "date": 1605452400000,
                "Cdesc": "Analisi 1",
                "CLdesc": "12",
                "id": 1,
                "name": "Mario",
                "presence": 1,
                "surname": "Rossi"
            },
            {
                "active": 1,
                "bookable": 0,
                "date": 1605547800000,
                "Cdesc": "Analisi 1",
                "CLdesc": "10",
                "id": 2,
                "name": "Mario",
                "presence": 0,
                "surname": "Rossi"
            },
            {
                "active": 1,
                "bookable": 1,
                "date": 1606057200000,
                "Cdesc": "Analisi 1",
                "CLdesc": "12",
                "id": 3,
                "name": "Mario",
                "presence": 1,
                "surname": "Rossi"
            },
            {
                "active": 1,
                "bookable": 1,
                "date": 1606152600000,
                "Cdesc": "Analisi 1",
                "CLdesc": "10",
                "id": 4,
                "name": "Mario",
                "presence": 1,
                "surname": "Rossi"
            }
        ]
    
      const response = await request(app).get('/api/student/lectures');
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
        "date": 1605022961000,
        "id": 2,
        "presence": 0,
        "ref_lecture": 2,
        "ref_student": 269901
    },
    {
        "active": 1,
        "date": 1605024581392,
        "id": 3,
        "presence": 0,
        "ref_lecture": 3,
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

const response = await request(app).get('/api/student/bookings');
expect(body.status).toBe(200);
expect(response.body).toEqual( studentBookingsExpected );
 });
});