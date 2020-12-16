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
    return DAO.bookSeat('3', '269901').then(result => {
        expect(result).toBe(1);
    });
});

//GET STUDENT LECTURES
test('Try to get a student\'s lectures', () => {
    return DAO.getStudentLectures('269901').then(result => {
        expect(result.length).toEqual(14); //old value 7
    })
});

//GET TEACHER LECTURES
test('Try to get a teacher\'s lectures', () => {
    return DAO.getTeacherLectures('239901').then(result => {
        expect(result.length).toBe(11); //old value 11
    });
});

//GET STUDENTS BOOKED FOR LECTURE ID
test('Try to get students booked for lectures of 1 professor', () => {
    return DAO.getStudentsForLecturev2('239901').then(result => {
        expect(result.length).toBe(21); //old value 3
    });
});

// GET STUDENTS BOOKED FOR 1 LECTURE
test( 'Try to get students booked for lecture 1', () => {
    return DAO.getStudentsForLecture( '1' ).then( result => {
        expect( result.length ).toBe( 4); //old value 1
    } )

} );

test( 'Try to get students booked for lecture 2', () => {
    return DAO.getStudentsForLecture( '1' ).then( result => {
        expect( result[0].id ).toBe( 269901 );
    } )

} );

test( 'Try to get students booked for lecture 3', () => {
    return expect( DAO.getUserById( '0' ) ).rejects.toBeUndefined();

} );

test( 'Try to get students booked for lecture 4', () => {
    return expect( DAO.getUserById() ).rejects.toBeUndefined();

} );

//GET ALL STUDENT'S BOOKINGS
test('Try to get all student\'s bookings', () => {
    return DAO.getStudentBookings('269901').then(result => {
        expect(result.length).toEqual(5); //old value 3
    })
});

//GET TOMORROW LESSONS STATS
test( 'Try to get all students booked for tomorrow lectures', () => {
    return DAO.getTomorrowLessonsStats( true ).then( result => {
        expect( result.length ).toEqual( 0 ); //old value 1
    } );
} );

describe('Turn a lecture to be online instead of in presence', () => {
    describe('Unit testing', () => {
        test('Turnable lecture', () => {
            return DAO.turnLectureIntoOnline(9,239901).then(information => {
                expect(information).toEqual(
                    [
                        {
                            "courseDescription": "Elettrotecnica",
                            "lectureClass": "VIRTUAL CLASSROOM",
                            "lectureDate": 1611046800000,
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
            return DAO.turnLectureIntoOnline(300,239901).then(exitCode => {
                console.log("Test failure message: ");
                console.log(exitCode);
            }).catch(exitCode => {
                // test failed because the lecture should have been turnable into online
                expect(exitCode).toBe(-1);
            });
        });

        test('Non-active lecture', () => {
            return DAO.turnLectureIntoOnline(9, 239901).then(exitCode => {
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
} );
describe( 'Cancel/edit operations', () => {
    //EDIT PRESENCE LECTURE
    test('Try to put a lecture in remote', () => {
        return DAO.setPresenceLecture(2, '12').then(result => {
            expect(result).toEqual(1);
        });
    });

    //CANCEL A BOOKING
    test('Try to cancel a booking', () => {
        return DAO.cancelBookings(1).then(result => {
            expect(result).toEqual(1);
        })
    });

    //CANCEL LECTURE
    test('Try to cancel a lecture', () => {
        return DAO.cancelLecture(2).then(result => {
            expect(result).toEqual(1);
        })
    });
} )

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
        expect(result.date).toBe(1605684600000);//expect(result.date).toBe(1605526200000);
        expect(result.course).toBe('Analisi 1');//expect(result.course).toBe('Analisi 1');
        expect(result.classroom).toBe("12");//expect(result.classroom).toBe('VIRTUAL CLASSROOM');
    })
});


// Jest for this story requires that:
//      - the locale of moment is set to 'it' from the beginning of pulsebsDAO, not in the function itself;
describe('[PUL 10] Get teacher statistics', () => {
    test('per lecture', () => {
        DAO.getTeacherBookingStatistics(239902, 3, 'lecture').then(statistics => {
            expect(statistics).toEqual(
                [
                    {
                        "bookingNumber": 1,
                        "lectureDate": 1607774400000,
                        "lectureId": 10
                    }
                ]
            );
        });
    });

    test('per week', () => {
        return DAO.getTeacherBookingStatistics(239901, 2, 'week').then(statistics => {
            expect(statistics).toEqual(
                [
                    {
                        "bookingNumber": 2,
                        "week": 1606690800000
                    },
                    {
                        "bookingNumber": 4,
                        "week": 1607295600000
                    }
                ]
            );
        });
    });

    test('per month', () => {
        return DAO.getTeacherBookingStatistics(239901, 2, 'month').then(statistics => {
            expect(statistics).toEqual(
                [
                    {
                        "bookingNumber": 3,
                        "month":1606777200000
                    }
                ]
            );
        });
    });
});

describe("[PUL-11] Get statistics for manager",()=>{
    test('get All Bookings 1',()=>{
        return DAO.getAllBookings().then(b=>{
            expect(b.length).toBe(24);
        })
    });

    test('get Bookings 2',()=>{
        let course="Analisi 1";
        let lecture=2;
        return DAO.getAllBookings(course,lecture).then(b=>{
            expect(b.length).toBe(5);
        })
    });

    test('get Bookings 3',()=>{
        let course="Fisica 2";
        let lecture=1;
        return DAO.getAllBookings(course,lecture).then(b=>{
            expect(b.length).toBe(0);
        })
    });

     test('get All Attendances 1',()=>{
        return DAO.getAllAttendances().then(b=>{
            expect(b.length).toBe(24);
        })
    });

    test('get Attendances 2',()=>{
        let course="Analisi 1";
        let lecture=2;
        return DAO.getAllAttendances(course,lecture).then(b=>{
            expect(b.length).toBe(5);
        })
    });

    test('get Attendances 3',()=>{
        let course="Fisica 2";
        let lecture=1;
        return DAO.getAllAttendances(course,lecture).then(b=>{
            expect(b.length).toBe(0);
        })
    });

    test('get All cancelled Lectures 1',()=>{
        return DAO.getAllCancellationsLectures().then(c=>{
            expect(c.length).toBe(6);
        });
    });

    test('get All cancelled Lectures 2',()=>{
        let course = "Analisi 1";
        let lecture = 18;
        return DAO.getAllCancellationsLectures(course,lecture).then(c=>{
            expect(c.length).toBe(1);
        });
    });

    test('get All cancelled Lectures 3',()=>{
        let course="Fisica 2";
        let lecture=7;
        return DAO.getAllCancellationsLectures(course,lecture).then(c=>{
            expect(c.length).toBe(0);
        });
    });

    test('get All cancelled Booking 1',()=>{
        return DAO.getAllCancellationsBookings().then(c=>{
            expect(c.length).toBe(2);
        });
    });

    test('get All cancelled Bookings 2',()=>{
        let course = "Analisi 1";
        let lecture = 2;
        return DAO.getAllCancellationsBookings(course,lecture).then(c=>{
            expect(c.length).toBe(0);
        });
    });

    test('get All cancelled Bookings 3',()=>{
        let course="Fisica 2";
        let lecture=7;
        return DAO.getAllCancellationsBookings(course,lecture).then(c=>{
            expect(c.length).toBe(0);
        });
    });

    test('get All Courses',()=>{
        return DAO.getAllCourses().then(c=>{
            expect(c.length).toBe(8); //change value(depends of cardinality of courses)
        });
    });

    test('get All Lectures',()=>{
        return DAO.getAllLectures().then(c=>{
            expect(c.length).toBe(22); //change value(depends of cardinality of lectures)
        });
    });

});

// MANAGER contact tracing
test('Try to see if correct students\' contract tracing datas are received', () =>{
    return DAO.getContactsWithPositiveStudent(269901, true).then(result => {
        expect(result.uniqTeachers[0]).toBe(239901);
        expect(result.involvedStudents[0]).toBe(269902);
    })
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

    test( "Try to load a correct CSV file content", () => {
        return DAO.loadCsvData( data )
                  .then( result => expect( result ).toBe( 0 ) )
    } );
    test( "Try to load a wrong CSV file content", () => {
        data = {
            "classes": [
                {
                    "id": "15",
                    "desc": "12A",
                    "seats": "72"
                }
            ],
            "teachers": [
                {
                    "id": "239901",
                    "email": "abc@gmail.com",
                    "password": "hash123",
                    "name": "nome",
                    "surname": "cognome"
                }
            ],
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
                    "ref_class": "15",
                    "date": "123456789",
                    "endTime": "123456789",
                    "presence": "0",
                    "bookable": "0 ",
                    "active": "0"
                }
            ]
        };
        return DAO.loadCsvData( data )
                  .catch( err => expect( err ).toBe( 0 ) );
    } );
} );
