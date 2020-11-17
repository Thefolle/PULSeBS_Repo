const DAO = require("../pulsebsDAO.js");

//REMEMBER TO CLEAR DATABASE BEFORE TESTING IN ORDER TO AVOID POSSIBLE ERRORS DUE TO CONFLICTS

describe("Login test suite", () => {
    test('Try to login with < davide.calarco@gmail.com, password>', () => {
        return DAO.getUserByEmail('davide.calarco@gmail.com', 'password').then(result => {
            expect(result.name).toBe('Davide');
        });
    });

    test('Try to login with < hyeronimus.bosch@gmail.com, password>', () => {
        return DAO.getUserByEmail('hyeronimus.bosch@gmail.com', 'password').then(result => {
            expect(result.name).toBe('Hyeronimus');
        });
    });

    test('Try to login with < harry.houdini@gmail.com, password>', () => {
        return DAO.getUserByEmail('harry.houdini@gmail.com', 'password').then(result => {
            expect(result.name).toBe('Harry');
        });
    });
});

//BOOKING A SEAT
test( 'Try to book a new seat', () => {
    return DAO.bookSeat( 2, 269901 ).then( result => {
        expect( result ).toBe( 1 );
    } );
} );

//GET STUDENT LECTURES
test( 'Try to get a student\'s lectures', () => {
    const studentLecturesExpected = [
        {
            "active": 1,
            "bookable": 1,
            "date": 1605452400000,
            "desc": "12",
            "id": 1,
            "name": "Mario",
            "presence": 1,
            "surname": "Rossi"
        },
        {
            "active": 1,
            "bookable": 1,
            "date": 1606057200000,
            "desc": "12",
            "id": 3,
            "name": "Mario",
            "presence": 1,
            "surname": "Rossi"
        },
        {
            "active": 1,
            "bookable": 1,
            "date": 1606152600000,
            "desc": "10",
            "id": 4,
            "name": "Mario",
            "presence": 1,
            "surname": "Rossi"
        }
    ];

    return DAO.getStudentLectures( '269901' ).then( result => {
        expect( result ).toEqual( studentLecturesExpected );
    } );
} );

//GET TEACHER LECTURES
test( 'Try to get a teacher\'s lectures', () => {
    /*const teacherLecturesExpected = [
        {
            "bookable": 1,
            "class": "12",
            "course": "Analisi 1",
            "date": 1605452400000,
            "id": 1,
            "lecId": 1,
            "presence": 1
        },
        {
            "bookable": 1,
            "class": "10",
            "course": "Analisi 1",
            "date": 1605547800000,
            "id": 1,
            "lecId": 2,
            "presence": 1
        },
        {
            
            "bookable": 1,
            "class": "12",
            "course": "Analisi 1",
            "date": 1606057200000,
            "id": 1,
            "lecId": 3,
            "presence": 1
        },
        {
            
            "bookable": 1,
            "class": "10",
            "course": "Analisi 1",
            "date": 1606152600000,
            "id": 1,
            "lecId": 4,
            "presence": 1
        } ];*/

    return DAO.getTeacherLectures(239901).then( result => {
        expect(result.length).toBe(4);
    } );
} );

//GET STUDENTS BOOKED FOR LECTURE ID
test('Try to get students booked for lectures of 1 professor', () => {
    /*const studentIdsExpected = [
        {"studentId" : 269901, "lId": 1},
        {"studentId" : 269901, "lId": 3},
        {"studentId" : 269901, "lId": 4},
        {"studentId" : 269901, "lId": 2}
        
    ];*/
    return DAO.getStudentsForLecturev2(239901).then( result => {
        expect(result.length).toBe(4);
    });
});

//CANCEL A BOOKING
test('Try to cancel a booking', () => {
    return DAO.cancelBooking(1).then( result => {
        expect(result).toEqual(1);
    });
});

//GET ALL STUDENT'S BOOKINGS
test('Try to get all student\'s bookings', () => {
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
];

    return DAO.getStudentBookings(269901).then( result => {
        expect(result).toEqual(studentBookingsExpected);
    });
});

//CANCEL LECTURE
test('Try to cancel a lecture', () => {
    return DAO.cancelLecture(2).then( result => {
        expect(result).toEqual(1);
    });
});

//EDIT PRESENCE LECTURE
test('Try to put a lecture in remote', () => {
    return DAO.setPresenceLecture(2).then( result => {
        expect(result).toEqual(1);
    });
});

/*test('It responds with JSON', () => {
      return request(app)
      .get('/api/...')
      .set('Authorization', Bearer ${token})
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.type).toBe('application/json');

expect(response.body).toEqual(...);
       });
    });
  });*/
