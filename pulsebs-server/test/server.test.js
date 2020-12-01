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
        expect(response.body.length).toEqual(4);
    });

});


//GET ALL STUDENT'S BOOKINGS
describe('get /api/student/bookings', () => {
    it('should return a 201 if succed', async () => {

        let lectureId = 2;
        const response = await request(server)
            .delete('/api/teacher/lectures/' + lectureId)
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(201);
    });
});

//  DELETE cancle the lecture that already booked
// FIXME:
describe( '/api/students/:studentId/bookings/:bookingId', () => {
    it( 'should return a 200 if exists', async () => {

          await request( app )
            .delete( '/api/students/269901/bookings/1' )
            .set( 'Cookie', `token=${ token }` )
            .set( 'Content-Type', 'application/json' )
            .then( ( res ) => {
                expect( res.status ).toBe( 201 );
                expect( res.body.response ).toBe( 1 );
            } );
    } );
} );


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
        expect(response.body.length).toEqual(4);
    });

});

describe('E2E testing/Integration testing', () => {
    test('Turnable lecture', async function () {
        let teacherId = 239901; // not really needed
        let lectureId = 1;
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
    test('Lecture is starting within 30 minutes', async function (done) {
        let teacherId = 2;
        let lectureId = 4;
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
});

// logout and server shutdown
afterAll(async () => {
    // Although logout works, being sure to close the server is needed to end the testing session gracefully;
    // await request(server)
    //     .post('api/logout')
    //     .set('Cookie', `token=${token}`);
    // expect(response.status).toBe(200);
    handleToCloseServer.close();
}, 10);


