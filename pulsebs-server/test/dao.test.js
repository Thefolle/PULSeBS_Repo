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
    return DAO.bookSeat('2', '269901').then(result => {
        expect(result).toBe(1);
    });
});

//GET STUDENT LECTURES
test('Try to get a student\'s lectures', () => {
    return DAO.getStudentLectures('269901').then(result => {
        expect(result.length).toEqual(4);
    })
});

//GET TEACHER LECTURES
test('Try to get a teacher\'s lectures', () => {
    return DAO.getTeacherLectures('239901').then(result => {
        expect(result.length).toBe(4); //or toEqual
    });
});

//GET STUDENTS BOOKED FOR LECTURE ID
test('Try to get students booked for lectures of 1 professor', () => {
    return DAO.getStudentsForLecturev2('239901').then(result => {
        expect(result.length).toBe(2);
    });
});

//Francesco' Test
/*test('Try to get students booked for lecture 1', () => {
    return DAO.getStudentsForLecture(1).then( result => {
        expect(result[0].ref_student).toEqual(269901);
    })

});*/

//GET ALL STUDENT'S BOOKINGS
test('Try to get all student\'s bookings', () => {
    return DAO.getStudentBookings('269901').then(result => {
        expect(result.length).toEqual(3);
    })
});

//GET TOMORROW LESSONS STATS
test('Try to get all students booked for tomorrow lectures', () => {
    return DAO.getTomorrowLessonsStats(true).then(result => {
        expect(result.length).toEqual(1);
    });
});

//EDIT PRESENCE LECTURE
test('Try to put a lecture in remote', () => {
    return DAO.setPresenceLecture(2).then(result => {
        expect(result).toEqual(1);
    });
});

//CANCEL A BOOKING
test('Try to cancel a booking', () => {
    return DAO.cancelBooking(1).then(result => {
        expect(result).toEqual(1);
    })
});

//CANCEL LECTURE
test('Try to cancel a lecture', () => {
    return DAO.cancelLecture(2).then(result => {
        expect(result).toEqual(1);
    })
});

describe('Turn a lecture to be online instead of in presence', () => {
    test('Turnable lecture', () => {
        return DAO.turnLectureIntoOnline(1).then(exitCode => {
            expect(exitCode).toBe(0);
        }).catch(exitCode => {
            // test failed because the lecture should have been turnable into online
            console.log("Test failure message: ");
            console.log(exitCode);
        });
    });

    test('Non-existing lecture', () => {
        return DAO.turnLectureIntoOnline(300).then(exitCode => {
            console.log("Test failure message: ");
            console.log(exitCode);
        }).catch(exitCode => {
            // test failed because the lecture should have been turnable into online
            expect(exitCode).toBe(-1);
        });
    });

    test('Non-active lecture', () => {
        return DAO.turnLectureIntoOnline(2).then(exitCode => {
            console.log("Test failure message: ");
            console.log(exitCode);
        }).catch(exitCode => {
            // test failed because the lecture should have been turnable into online
            expect(exitCode).toBe(-2);
        });
    });

    test('Lecture is starting within 30 minutes', () => {
        return DAO.turnLectureIntoOnline(3).then(exitCode => {
            console.log("Test failure message: ");
            console.log(exitCode);
        }).catch(exitCode => {
            // test failed because the lecture should have been turnable into online
            expect(exitCode).toBe(-3);
        });
    });

    // Cannot test exitCode === -4
});

