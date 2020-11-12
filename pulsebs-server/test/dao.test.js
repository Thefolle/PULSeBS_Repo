const DAO = require( "../pulsebsDAO.js" );

//REMEMBER TO CLEAR DATABASE BEFORE TESTING IN ORDER TO AVOID POSSIBLE ERRORS DUE TO CONFLICTS

//LOGIN
test( 'Try to login with < student1@gmail.com, ciao123>', () => {
    return DAO.checkUser( 'student1@gmail.com', 'ciao123', 1 ).then( result => {
        expect( result ).toBe( true );
    } )
} );

test( 'Try to login with < teacher1@gmail.com, ciao123>', () => {
    return DAO.checkUser( 'teacher1@gmail.com', 'ciao123', 2 ).then( result => {
        expect( result ).toBe( true );
    } )
} );

test( 'Try to login with < staff1@gmail.com, ciao123>', () => {
    return DAO.checkUser( 'staff1@gmail.com', 'ciao123', 3 ).then( result => {
        expect( result ).toBe( true );
    } )
} );

//BOOKING A SEAT
test( 'Try to book a new seat', () => {
    return DAO.bookSeat( 2, 269901 ).then( result => {
        expect( result ).toBe( 1 );
    } )
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
            "date": 1605547800000,
            "desc": "10",
            "id": 2,
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
    ]

    return DAO.getStudentLectures( '269901' ).then( result => {
        expect( result ).toEqual( studentLecturesExpected );
    } )
} );

//GET TEACHER LECTURES
test( 'Try to get a teacher\'s lectures', () => {
    const teacherLecturesExpected = [
        {
            "bookable": 1,
            "class": "12",
            "course": "Analisi 1",
            "date": 1605452400000,
            "presence": 1
        },
        {
            "bookable": 1,
            "class": "10",
            "course": "Analisi 1",
            "date": 1605547800000,
            "presence": 1
        },
        {
            "bookable": 1,
            "class": "12",
            "course": "Analisi 1",
            "date": 1606057200000,
            "presence": 1
        },
        {
            "bookable": 1,
            "class": "10",
            "course": "Analisi 1",
            "date": 1606152600000,
            "presence": 1
        } ]

    return DAO.getTeacherLectures( '239901' ).then( result => {
        expect( result ).toEqual( teacherLecturesExpected );
    } )
} );

//GET STUDENTS BOOKED FOR LECTURE ID
test('Try to get students booked for lecture 1', () => {
    const studentIdsExpected = [
        {"ref_student" : 269901}
    ];
    return DAO.getStudentsForLecture(1).then( result => {
        expect(result).toEqual(studentIdsExpected);
    })
});

//CANCEL A BOOKING
test('Try to cancel a booking', () => {
    return DAO.cancelBooking(1).then( result => {
        expect(result).toEqual(1);
    })
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
]

    return DAO.getStudentBookings(269901).then( result => {
        expect(result).toEqual(studentBookingsExpected);
    })
});

//CANCEL LECTURE
test('Try to cancel a lecture', () => {
    return DAO.cancelLecture(2).then( result => {
        expect(result).toEqual(1);
    })
});

//EDIT PRESENCE LECTURE
test('Try to put a lecture in remote', () => {
    return DAO.setPresenceLecture(2).then( result => {
        expect(result).toEqual(1);
    })
});
