const DAO = require("../pulsebsDAO.js");

describe("Login test suite", () => {
    test('Try to login with < davide.calarco@gmail.com, password>', () => {
        return DAO.getUserByEmail('davide.calarco@gmail.com').then(result => {
            expect(result.name).toBe('Davide');
        });
    });

    test('Try to login with < hyeronimus.bosch@gmail.com, password>', () => {
        return DAO.getUserByEmail('hyeronimus.bosch@gmail.com').then(result => {
            expect(result.name).toBe('Hyeronimus');
        });
    });

    test('Try to login with < harry.houdini@gmail.com, password>', () => {
        return DAO.getUserByEmail('harry.houdini@gmail.com').then(result => {
            expect(result.name).toBe('Harry');
        });
    });

    // Test authenticated user
    test('Try information about one user authenticated', () => {
        return DAO.getUserById('239901').then(result => {
            expect(result.name).toBe("Hyeronimus");
        });
    });

    test('Try information about one user authenticated 2', () => {
        return expect(DAO.getUserById('239900')).rejects.toBeUndefined();
    });

    test('Try information about one user authenticated 3', () => {
        return expect(DAO.getUserById()).rejects.toBeUndefined();
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
        expect(result.length).toEqual(7);
    })
});

//GET TEACHER LECTURES
test('Try to get a teacher\'s lectures', () => {
    return DAO.getTeacherLectures('239901').then(result => {
        expect(result.length).toBe(7); //or toEqual
    });
});

//GET STUDENTS BOOKED FOR LECTURE ID
test('Try to get students booked for lectures of 1 professor', () => {
    return DAO.getStudentsForLecturev2('239901').then(result => {
        expect(result.length).toBe(2);
    });
});

// GET STUDENTS BOOKED FOR 1 LECTURE
test('Try to get students booked for lecture 1', () => {
    return DAO.getStudentsForLecture('1').then(result => {
        expect(result.length).toBe(1);
    })

});

test('Try to get students booked for lecture 2', () => {
    return DAO.getStudentsForLecture('1').then(result => {
        expect(result[0].id).toBe(269901);
    })

});

test('Try to get students booked for lecture 3', () => {
    return expect(DAO.getUserById('0')).rejects.toBeUndefined();

});

test('Try to get students booked for lecture 4', () => {
    return expect(DAO.getUserById()).rejects.toBeUndefined();

});

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

describe('Turn a lecture to be online instead of in presence', () => {
    describe('Unit testing', () => {
        test('Turnable lecture', () => {
            return DAO.turnLectureIntoOnline(239901, 1).then(information => {
                expect(information).toEqual(
                    [
                        {
                            "courseDescription": "Analisi 1",
                            "lectureClass": "VIRTUAL CLASSROOM",
                            "lectureDate": 1605526200000,
                            "studentEmail": "davide.calarco@gmail.com",
                            "studentId": 269901,
                            "studentName": "Davide",
                            "studentSurname": "Calarco"
                        }
                    ]);
            }).catch(exitCode => {
                // test failed because the lecture should have been turnable into online
                console.log("Test failure message: ");
                console.log(exitCode);
            });
        });

        test('Non-existing lecture', () => {
            return DAO.turnLectureIntoOnline(239901, 300).then(exitCode => {
                console.log("Test failure message: ");
                console.log(exitCode);
            }).catch(exitCode => {
                // test failed because the lecture should have been turnable into online
                expect(exitCode).toBe(-1);
            });
        });

        test('Non-active lecture', () => {
            return DAO.turnLectureIntoOnline(239901, 5).then(exitCode => {
                console.log("Test failure message: ");
                console.log(exitCode);
            }).catch(exitCode => {
                // test failed because the lecture should have been turnable into online
                expect(exitCode).toBe(-2);
            });
        });

        // ( 'Lecture is starting within 30 minutes', () => {
        //     return DAO.turnLectureIntoOnline( 239901,6 ).then( exitCode => {
        //         console.log( "Test failure message: " );
        //         console.log( exitCode );
        //     } ).catch( exitCode => {
        //         // test failed because the lecture should have been turnable into online
        //         expect( exitCode ).toBe( -3 );
        //     } );
        // } );
    });
    // Cannot test exitCode === -4
});
describe('Cancel/edit operations', () => {
    //EDIT PRESENCE LECTURE
    test('Try to put a lecture in remote', () => {
        return DAO.setPresenceLecture(2, '12').then(result => {
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
})

// GET INFO BY STUDENT ID
test('Try to see if student infos are correct', () => {
    return DAO.getInfoByStudentId(269901).then(result => {
        expect(result.email).toBe('davide.calarco@gmail.com');
        expect(result.name).toBe('Davide');
        expect(result.surname).toBe('Calarco');
    })
});

// GET LECTURE STATS
test('Try to see if lecture stats are the correct ones', () => {
    return DAO.getLectureStats(1).then(result => {
        expect(result.date).toBe(1605526200000);
        expect(result.course).toBe('Analisi 1');
        expect(result.classroom).toBe('VIRTUAL CLASSROOM');
    })
});


// Jest for this story requires that:
//      - the locale of moment is set to 'it' from the beginning of pulsebsDAO, not in the function itself;
describe('[PUL 11] Get teacher statistics', () => {
    test('per lecture', () => {
        DAO.getTeacherBookingStatistics(239903, 5, 'lecture').then(statistics => {
            expect(statistics).toEqual(
                [
                    {
                        "bookingsNumber": 2,
                        "lectureDate": 1605526200000,
                        "lectureId": 1
                    },
                    {
                        "bookingsNumber": 1,
                        "lectureDate": 1605699000000,
                        "lectureId": 2
                    },
                    {
                        "bookingsNumber": 1,
                        "lectureDate": 1606303800000,
                        "lectureId": 4
                    }
                ]
            );
        });
    });

    test('per week', () => {
        return DAO.getTeacherBookingStatistics(239903, 5, 'week').then(statistics => {
            expect(statistics).toEqual(
                [
                    {
                        "bookingNumber": 3,
                        "week": 1605481200000
                    },
                    {
                        "bookingNumber": 1,
                        "week": 1606086000000
                    }
                ]
            );
        });
    });

    test('per month', () => {
        return DAO.getTeacherBookingStatistics(239903, 5, 'month').then(statistics => {
            expect(statistics).toEqual(
                [
                    {
                        "bookingNumber": 4,
                        "month": 1604185200000
                    }
                ]
            );
        });
    });
});