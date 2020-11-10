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
    return DAO.bookSeat( 1, '269901' ).then( result => {
        expect( result ).toBe( 1 );
    } )
} );

//GET STUDENT LECTURES
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
test( 'Try to get a student\'s lectures', () => {
    return DAO.getStudentLectures( '269901' ).then( result => {
        expect( result ).toEqual( studentLecturesExpected );
    } )
} );

//GET TEACHER LECTURES
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
test( 'Try to get a teacher\'s lectures', () => {
    return DAO.getTeacherLectures( '239901' ).then( result => {
        expect( result ).toEqual( teacherLecturesExpected );
    } )
} );