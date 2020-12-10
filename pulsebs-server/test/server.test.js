const request = require("supertest");
const { server, handleToCloseServer } = require("../server");

let token;

beforeAll((done) => {

    request(server)
        .post('/api/login')
        .send({ email: 'davide.calarco@gmail.com', password: 'password' })
        .end((error, response) => {
            if (error) return done(error);
            token = response.body.token;
            done();
        });
});


//POST BOOK A SEAT
// FIXME:
describe('post /api/students/:studentId/booking', () => {
    it('POST should return a 1', async () => {
        const lectureId = 2;

        const res = await request(server)
            .post('/api/students/269901/booking')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({ lectureId: lectureId });
        expect(res.status).toBe(201);
        expect(res.body.response).toBe(1);

    });

});


//GET STUDENT LECTURES

describe('get /api/student/lectures', () => {
    it('should return a 200 if exists', async () => {

        const response = await request(server)
            .get('/api/student/lectures')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(7);
    });

});


//GET ALL STUDENT'S BOOKINGS
describe('get /api/student/bookings', () => {
    it('should return a 201 if succeed', async () => {

        let lectureId = 2;
        let teacherId = 239901;
        const response = await request(server)
            .delete('/api/teachers/' + teacherId + '/lectures/' + lectureId)
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
    });
});

//  DELETE cancle the lecture that already booked
// FIXME:
describe('/api/students/:studentId/bookings/:bookingId', () => {
    it('should return a 200 if exists', async () => {

        await request(server)
            .delete('/api/students/269901/bookings/1')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .then((res) => {
                expect(res.status).toBe(201);
                expect(res.body.response).toBe(1);
            });
    });
});


//DELETE TEACHER'S LECTURE
// FIXME:
describe('delete /api/teachers/:teacherId/lectures/:lectureId', () => {
    it('should return a 201 if exists', async () => {

        const response = await request(server)
            .delete('/api/teachers/239901/lectures/1')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200);
        expect(response.body.response).toEqual(1);
    });

});

describe('E2E testing/Integration testing', () => {
    test('Turnable lecture', async function () {
        let teacherId = 239901; // not really needed
        let lectureId = 7;
        let response = await request(server)
            .put('/api/teachers/' + teacherId + '/lectures/' + lectureId)
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({ presence: 0 });
        expect(response.status).toBe(200);
    });


    test('Non-existing lecture', function (done) {
        let teacherId = 2;
        let lectureId = 300;
        request(server)
            .put('/api/teachers/' + teacherId + '/lectures/' + lectureId)
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({ presence: 0 })
            .end(function (error, response) {
                if (error) return done(error);
                expect(response.status).toBe(404);
                done();
            });
    });

    test('Non-active lecture', function (done) {
        let teacherId = 239901;
        let lectureId = 2;
        request(server)
            .put('/api/teachers/' + teacherId + '/lectures/' + lectureId)
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send({ presence: 0 })
            .end(function (error, response) {
                if (error) return done(error);
                expect(response.status).toBe(409);
                done();
            });
    });

    //Maybe this test couldn't be done
    // ('Lecture is starting within 30 minutes', async function (done) {
    //     let teacherId = 2;
    //     let lectureId = 4;
    //     request(server)
    //         .put('/api/teachers/' + teacherId + '/lectures/' + lectureId)
    //         .set('Cookie', `token=${token}`)
    //         .set('Content-Type', 'application/json')
    //         .send({ presence: 0 })
    //         .end(function (error, response) {
    //             if (error) return done(error);
    //             expect(response.status).toBe(409);
    //             done();
    //         });
    // });
});

describe('[PUL 10] Get teacher statistics', () => {
    test('Check returned status', function (done) {
        let teacherId = 239903;
        let courseId = 5;
        request(server)
            .get('/api/teachers/' + teacherId + '/statistics/courses/' + courseId)
            .query({ groupBy: 'lecture' })
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .end(function (error, response) {
                if (error) return done(error);
                expect(response.status).toBe(200);
                done();
            });
    });
});

describe( 'CSV loading tests', () => {
    let data = {
        "classes": [
            {
                "id": "15",
                "desc": "12A",
                "seats": "72"
            }
        ],
        "teachers": [
            {
                "id": "239910",
                "email": "abc@gmail.com",
                "password": "hash123",
                "name": "nome",
                "surname": "cognome"
            }
        ],
        "students": [
            {
                "id": "269910",
                "email": "abc@gmail.com",
                "password": "hash123",
                "name": "nome",
                "surname": "cognome"
            }
        ],
        "courses": [
            {
                "id": "90",
                "desc": "ABC course",
                "ref_teacher": "239910"
            }
        ],
        "subscriptions": [
            {
                "ref_student": "269910",
                "ref_course": "90"
            }
        ],
        "lectures": [
            {
                "ref_course": "90",
                "ref_class": "15",
                "date": "123456789",
                "endTime": "123456789",
                "presence": "0",
                "bookable": "0 ",
                "active": "0"
            }
        ]
    };

    test( "Try to load a correct CSV file content", async function () {
        let response = await request(server)
            .put('/api/sofficer/')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send(data);
        expect(response.status).toBe(200);
    } );

    test( "Try to load a wrong CSV file content", async function () {
        data = {
            "students": [
                {
                    "id": "269901",
                    "email": "abc@gmail.com",
                    "password": "hash123",
                    "name": "nome",
                    "surname": "cognome"
                }
            ],
            "courses": [
                {
                    "id": "90",
                    "desc": "ABC course",
                    "ref_teacher": "239910"
                }
            ],
            "subscriptions": [
                {
                    "ref_student": "269910",
                    "ref_course": "90"
                }
            ],
            "lectures": [
                {
                    "ref_course": "90",
                    "date": "123456789",
                    "endTime": "123456789",
                    "presence": "0",
                    "bookable": "0 ",
                    "active": "0"
                }
            ]
        };
        let response = await request(server)
            .put('/api/sofficer/')
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .send(data);
        expect(response.status).toBe(400);
    } );
} );

// logout and server shutdown
afterAll(async () => {
    // Although logout works, being sure to close the server is needed to end the testing session gracefully;
    // await request(server)
    //     .post('api/logout')
    //     .set('Cookie', `token=${token}`);
    // expect(response.status).toBe(200);
    handleToCloseServer.close();
}, 10);


