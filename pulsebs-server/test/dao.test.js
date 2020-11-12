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
test('Try to book a new seat', () => {
    return DAO.bookSeat(1, '269901').then(result => {
        expect(result).toBe(1);
    })
});

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
test('Try to get a student\'s lectures', () => {
    return DAO.getStudentLectures('269901').then(result => {
        // expect(result).toEqual(studentLecturesExpected);
    })
});

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
    }]
test('Try to get a teacher\'s lectures', () => {
    return DAO.getTeacherLectures('239901').then(result => {
        expect(result).toEqual(teacherLecturesExpected);
    })
});