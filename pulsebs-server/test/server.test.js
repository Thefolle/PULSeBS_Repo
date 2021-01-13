const request = require("supertest");
const { server, handleToCloseServer } = require("../server");

let token;

describe('API STUDENT', () => {
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
            const lectureId = 4;

            const res = await request(server)
                .post('/api/students/269901/booking')
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .send({ lectureId: lectureId });
            expect(res.status).toBe(201);
            expect(res.body.response).toBe(1);

        });

    });

    describe('post /api/students/:studentId/booking error', () => {
        it('error 401', async () => {

            const res = await request(server)
                .post('/api/students/269901/booking')
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json');
            expect(res.status).toBe(401);
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
            expect(response.body.length).toEqual(14);
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
    describe('Try to cancel some bookings', () => {
        test('Try to cancel a booking correctly', async function () {
            let studentId = 269901;
            let bookingId = 1;
            let response = await request(server)
                .delete('/api/students/' + studentId + '/bookings/' + bookingId)
                .set('Cookie', `token=${token}`)
            expect(response.status).toBe(201);
        });
        test('Try to cancel a booking wrongly - Wrong url', async function () {
            let studentId = 123456;
            let response = await request(server)
                .delete('/api/students/' + studentId + '/bookings/')
                .set('Cookie', `token=${token}`)
            expect(response.status).toBe(404);
        });
        test('Try to cancel a booking wrongly - Wrong params', async function () {
            let studentId = 123456;
            let bookingId = 60;
            let response = await request(server)
                .delete('/api/students/' + studentId + '/bookings/' + bookingId)
                .set('Cookie', `token=${token}`)
            expect(response.status).toBe(401);
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

    /**
     * @Feihong
     * Add a student to a waiting list
     * @Note
     *
     */
    describe( '/api/students/:studentId/lectures/:lectureId', () => {
        it( 'should return a 201 if add successful', async () => {
          let studentId = 269905;
          let lectureId = 23;
          await request( server )
                .put('/api/students/' + studentId + '/lectures/' + lectureId)
                .set( 'Cookie', `token=${ token }` )
                .set( 'Content-Type', 'application/json' )
                .then( ( res ) => {
                    expect( res.status ).toBe( 201 );
                } );
        } );
    } );


    /**
     * @Feihong
     * get waiting list of lecures of a student
     * @Note
     * there should be at least a lecture for current student here
     */
    describe( '/api/student/waitings', () => {
        it( 'should return a 200 if get waitings', async () => {

            await request( server )
                .get( '/api/student/waitings' )
                .set( 'Cookie', `token=${ token }` )
                .set( 'Content-Type', 'application/json' )
                .then( ( res ) => {
                    expect( res.status ).toBe( 200 );
                } );
        } );
    } );

    /**
     * @Feihong
     * According the free seats of a lecture, to Update the bookable attribute of table lecture
     * @Note
     * there are free seats of lecture 1's class room
     */
    describe( '/api/students/:studentId/lectures/checkSeats/:lectureId', () => {
        it( 'should return a 200 if there are free seats for lecture 1', async () => {

            await request( server )
                .post( '/api/students/269901/lectures/checkSeats/1'  )
                .set( 'Cookie', `token=${ token }` )
                .set( 'Content-Type', 'application/json' )
                .then( ( res ) => {
                    expect( res.status ).toBe( 200 );
                } );
        } );
    } );

    /**
     * @Feihong
     * cancle a booking
     * @Note
     * there is a booing in booking table with id 1
     */
    describe( '/api/students/:studentId/bookings/:bookingId', () => {
        it( 'should return a 200 if successful', async () => {

            await request( server )
                .delete( '/api/students/269901/bookings/1'  )
                .set( 'Cookie', `token=${ token }` )
                .set( 'Content-Type', 'application/json' )
                .then( ( res ) => {
                    expect( res.status ).toBe( 201 );
                } );
        } );
    } );


    /**
     * @Feihong
     * delete a waiting item from waiting table and add a new booking
     * @Note
     * for lecture 1, there sould be waiting item in wait table
     */
    describe( '/api/students/:studentId/lectures/:lectureId/waiting', () => {
        it( 'should return a 200 if successful', async () => {

            await request( server )
                .delete( '/api/students/269903/lectures/23/waiting'  )
                .set( 'Cookie', `token=${ token }` )
                .set( 'Content-Type', 'application/json' )
                .then( ( res ) => {
                    expect( res.status ).toBe( 200 );
                } );
        } );
        it('should return a 404 if wrong err', async()=>{
            let studentId=269902;
            let luctureId=undefined;
            const response=await request( server)
                .delete('/api/students/'+studentId+'/lectures/'+undefined+'/waiting')
                 .set( 'Cookie', `token=${ token }` )
                .set( 'Content-Type', 'application/json' );
            expect(response.status).toBe(404);

        });
    } );

    /**
     * @Feihong
     *
     * @Note
     *
     */
    //  DELETE cancle the lecture that already booked
    describe( '/api/students/:studentId/bookings/:bookingId', () => {
        it( 'should return a 200 if exists', async () => {

            await request( server )
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
        expect(response.body.response).toEqual(1);
    } );

    it('should return a 500 if gave errors', async () => {

        const response = await request(server)
            .delete('/api/teachers/239901/lectures/'+undefined)
            .set('Cookie', `token=${token}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(500);
    } );
} );

describe('get /api/student/bookings',()=>{
    it('should return a 201 if exists',async()=>{
    const response = await request(server)
        .get('/api/student/bookings')
        .set('Cookie', `token=${token}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200);
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

});

describe('API TEACHER', () => {
    beforeAll((done) => {

        request(server)
            .post('/api/login')
            .send({ email: 'hyeronimus.bosch@gmail.com', password: 'password' })
            .end((error, response) => {
                if (error) return done(error);
                token = response.body.token;
                done();
            });
    });

    describe('get /api/user', () => {
        it('should return a 200 if succeed', async () => {

            const response = await request(server)
                .get('/api/user')
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(239901);
        });
    });

    //GET TEACHER LECTURES

    describe('get /api/teacher/lectures', () => {
        it('should return a 200 if exists', async () => {

            const response = await request(server)
                .get('/api/teacher/lectures')
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(response.body.length).toEqual(9);
        });

    });


    //GET ALL TEACHER'S BOOKINGS
    describe('/api/teacher/getStudentsForLecture', () => {
        it('should return a 200 if succeed', async () => {

            const response = await request(server)
                .get('/api/teacher/getStudentsForLecture')
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(26);
        });
    });

    describe('[PUL 10] Get teacher statistics', () => {
        test('Check returned status', function (done) {
            let teacherId = 239903;
            let courseId = 5;
            request(server)
                .get('/api/teachers/' + teacherId + '/statistics/courses/' + courseId )
                .query({ groupBy: 'lecture', presence: "0" })
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .end(function (error, response) {
                    if (error) return done(error);
                    expect(response.status).toBe(200);
                    done();
                });
        });

        test('Check returned status - Presence ON', function (done) {
            let teacherId = 239903;
            let courseId = 5;
            request(server)
                .get('/api/teachers/' + teacherId + '/statistics/courses/' + courseId )
                .query({ groupBy: 'lecture', presence: "1" })
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .end(function (error, response) {
                    if (error) return done(error);
                    expect(response.status).toBe(200);
                    done();
                });
        });

    });

    describe('Setting multiple student presences', () => {
        test( 'Trying to set both presences and absences', async () => {
            let studentIds = [
                {
                    id: 269901,
                    presence: 1
                },
                {
                    id: 269902,
                    presence: 1
                },
                {
                    id: 269903,
                    presence: 1
                },
                {
                    id: 269904,
                    presence: 1
                },

            ]
            const response = await request(server)
                .put('/api/teacher/1/lecture/1/presence')
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(studentIds)
            expect(response.status).toBe(200);
        } )

        test( 'Trying to get both presences and absences', async () => {
        const response = await request(server)
                .put('/api/teacher/1/lecture/1/presence')
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(500);
    } )
     test( 'Trying to get both presences and absences', async () => {
            const response = await request(server)
                .get('/api/teacher/1/lecture/1/presence')
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
        } )

        test( 'Trying to get both presences and absences null', async () => {
            const response = await request(server)
                .get('/api/teacher/1/lecture/4/presence')
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
        } )
    });

    describe('Turn lecture into online errors',()=>{
  it('presence===1',async ()=>{
      let teacherId=239901;
      let lectureId=9;

      let response=await request(server)
        .put('/api/teachers/'+teacherId+'/lectures/'+lectureId)
        .send({presence:1})
        .set('Cookie', `token=${token}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
     expect(response.status).toBe(409);
  })

  it('presence==0',async ()=>{
      let teacherId=239901;
      let lectureId=9;

      let response=await request(server)
        .put('/api/teachers/'+teacherId+'/lectures/'+lectureId)
        .send({presence:3})
        .set('Cookie', `token=${token}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
     expect(response.status).toBe(422);
  })

})

    // logout and server shutdown
    afterAll(async () => {
        // Although logout works, being sure to close the server is needed to end the testing session gracefully;
        // await request(server)
        //     .post('api/logout')
        //     .set('Cookie', `token=${token}`);
        // expect(response.status).toBe(200);
        handleToCloseServer.close();
    }, 10);
});

describe('API MANAGER', () => {
    beforeAll((done) => {

        request(server)
            .post('/api/login')
            .send({ email: 'harry.houdini@gmail.com', password: 'password' })
            .end((error, response) => {
                if (error) return done(error);
                token = response.body.token;
                done();
            });
    });

    describe('get /api/user', () => {
        it('should return a 200 if succeed', async () => {

            const response = await request(server)
                .get('/api/user')
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(1);
        });
    });


    describe('get /api/manager/getAllCourses', () => {
        it('should return a 200 if exists', async () => {

            const response = await request(server)
                .get('/api/manager/getAllCourses')
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(response.body.length).toEqual(8);
        });

    });

    describe('get /api/manager/getAllLectures', () => {
        it('should return a 200 if exists', async () => {

            const response = await request(server)
                .get('/api/manager/getAllLectures')
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(response.body.length).toEqual(23);
        });

    });

    describe('/api/manager/getAllBookings', () => {
        it('should return a 200 if succeed', async () => {

            const response = await request(server)
                .get('/api/manager/getAllBookings')
                .query({ course: "All", lecture: -1 })
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(34);
        });
    });

    describe('/api/manager/getAllBookings 2', () => {
        it('should return a 200 if succeed', async () => {

            const response = await request(server)
                .get('/api/manager/getAllBookings')
                .query({ course: "Analisi 1", lecture: -1 })
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(18);
        });
    });

    describe('/api/manager/getAllCancellationsLectures', () => {
        it('should return a 200 if succeed', async () => {

            const response = await request(server)
                .get('/api/manager/getAllCancellationsLectures')
                .query({ course: "All", lectures: -1 })
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(5);
        });
    });

    describe('/api/manager/getAllCancellationsBookings', () => {
        it('should return a 200 if succeed', async () => {

            const response = await request(server)
                .get('/api/manager/getAllCancellationsBookings')
                .query({ course: "All", lecture: -1 })
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
        });
    });

    describe('/api/manager/getAllAttendances', () => {
        it('should return a 200 if succeed', async () => {

            const response = await request(server)
                .get('/api/manager/getAllAttendances')
                .query({ course: "All", lecture: -1 })
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(33); //change this value
        });
    });

    describe('get /api/manager/contactWithStudent/:studentId', () => {
        it('should return a 200 if succeed', async() => {

            let studentId = 269901;
            const response = await request(server)
                .get('/api/manager/contactWithStudent/' + studentId)
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
        });

        it('should return a 500 if succeed', async() => {

            let studentId = 269901;
            const response = await request(server)
                .get('/api/manager/contactWithStudent/' + undefined)
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(500);
        });
    });

    describe('get /api/manager/contactWithTeacher/:teacherId', () => {
        it('should return a 200 if succeed', async() => {

            let teacherId = 239901;
            const response = await request(server)
                .get('/api/manager/contactWithTeacher/' + teacherId)
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
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
});

describe('Get student and teacher infos starting from their ssn code', () => {

    describe('get /api/student/getFromSSN/:ssn', () => {
        it('should return a 200 if succeed', async() => {

            let ssn = "CLRDVD80A01H501C";
            const response = await request(server)
                .get('/api/student/getFromSSN/' + ssn)
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
            expect(response.status).toBe(200);
        });
    });

    describe('get /api/teachers/getFromSSN/:ssn', () => {
        it('should return a 200 if succeed', async() => {

            let ssn = "HYRBCH80A01H501Y";
            const response = await request(server)
                .get('/api/teachers/getFromSSN/' + ssn)
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
            expect(response.status).toBe(200);
        });
    });
});

describe('API Officer', () => {
    beforeAll((done) => {

        request(server)
            .post('/api/login')
            .send({ email: 'john.doe@gmail.com', password: 'password' })
            .end((error, response) => {
                if (error) return done(error);
                token = response.body.token;
                done();
            });
    });

    describe('CSV loading tests', () => {
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
                    "surname": "cognome",
                    "ssn": "ABCD1234ABCD1234"
                }
            ],
            "students": [
                {
                    "id": "269910",
                    "email": "abc@gmail.com",
                    "password": "hash123",
                    "name": "nome",
                    "surname": "cognome",
                    "ssn": "ABCD1234ABCD1234"
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

        test("Try to load a correct CSV file content", async function () {
            let response = await request(server)
                .put('/api/sofficer/')
                .set('Cookie', `token=${token}`)
                .set('Content-Type', 'application/json')
                .send(data);
            expect(response.status).toBe(200);
        });

        test("Try to load a wrong CSV file content", async function () {
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
        });
    });
/**
     * @Feihong
     * @story17
     * Get all the Lectures for SupportOffice page
     * GET: /api/supportOffice/lectures
     */
    describe('/api/supportOffice/lectures', ()=> {
        it('should return a 200 if get lectures', async () =>{
            await request( server )
                .get( '/api/supportOffice/lectures' )
                .set( 'Cookie', `token=${ token }` )
                .set( 'Content-Type', 'application/json' )
                .then( ( res ) => {
                    expect( res.status ).toBe( 200 );})
    })
})
    /**
     * @Feihong
     * @Story17
     * Update the bookable attribute for the lecture that was clicked by support officer
     * POST: /api/supportOffice/lecture/:lectureId/:num
     */
    describe('/api/supportOffice/lecture/:lectureId/:num', ()=>{
        it('should return a 200 if there is a lecture id is 1 ', async()=>{
            await request( server )
                .post( '/api/supportOffice/lecture/1/0'  )
                .set( 'Cookie', `token=${ token }` )
                .set( 'Content-Type', 'application/json' )
                .then( ( res ) => {
                    expect( res.status ).toBe( 200 );
        })
    });
})


    describe('Try to cancel lectures by date to update the schedule', () => {
        test('Try to cancel lectures correctly', async function () {
            let startDate = 1610236800000;
            let endDate = 1611100800000;
            let response = await request(server)
                .delete(`/api/supportOffice/lectures/delete?from=${ startDate }&to=${ endDate }`)
                .set('Cookie', `token=${token}`)
            expect(response.status).toBe(200);
        });
        test('Try to cancel lectures/bookings wrongly - Wrong url', async function () {
            let startDate = 1610236800000;
            let endDate = 1611100800000;
            let response = await request(server)
                .delete(`/api/supportOffice/delete?from=${ startDate }&to=${ endDate }`)
                .set('Cookie', `token=${token}`)
            expect(response.status).toBe(404);
        });
        /*test('Try to cancel lectures wrongly - Wrong params', async function () {
            let startDate = 1610236800000;
            let endDate;
            let response = await request(server)
                .delete(`/api/supportOffice/delete?from=${ startDate }&to=${ endDate }`)
                .set('Cookie', `token=${token}`)
            expect(response.status).toBe(401);
        });*/
        test('Try to cancel bookings correctly', async function () {
            let startDate = 1610236800000;
            let endDate = 1611100800000;
            let response = await request(server)
                .delete(`/api/supportOffice/bookings/delete?from=${ startDate }&to=${ endDate }`)
                .set('Cookie', `token=${token}`)
            expect(response.status).toBe(200);
        });
    });

    describe('Try to change lectures to update the schedule',()=>{
       test('Try to update the schedule',async ()=>{
           let startDate=1610751600000;
           let endDate=1611529200000;
           let lectures=[{ref_course:6,ref_class:2,date:1610890200000,endTime:1610895600000,presence:1,bookable:1,active:1}];
           let val={startDate,endDate,lectures};
           let response = await request(server)
               .put('/api/sofficer/updateLecture/')
               .set('Cookie', `token=${token}`)
               .set('Content-Type', 'application/json')
               .send(val);
           expect(response.status).toBe(200);
       });

       test('Try to update the schedule error 1',async ()=>{
           //let startDate=1610751600000;
           let endDate=1611529200000;
           let lectures=[{ref_course:6,ref_class:2,date:1610890200000,endTime:1610895600000,presence:1,bookable:1,active:1}];
           let val={endDate,lectures};
           let response = await request(server)
               .put('/api/sofficer/updateLecture/')
               .set('Cookie', `token=${token}`)
               .set('Content-Type', 'application/json')
               .send(val);
           expect(response.status).toBe(400);
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
});

describe("API 2",()=>{
    it('should return a 401 if succeed', async () => {
        const response = await request(server)
            .post('/api/login')
            .send({email: 'davide.calarco@gmail.com',password: 'password1'})
        expect(response.status).toBe(401);
    });

    it('should return a 401 if succeed', async () => {
        const response = await request(server)
            .post('/api/login')
        expect(response.status).toBe(401);
    });

    it('should return a 401 if succeed', async () => {
        const response = await request(server)
            .get( '/api/teacher/lectures')
        expect(response.status).toBe(401);
    });

})
