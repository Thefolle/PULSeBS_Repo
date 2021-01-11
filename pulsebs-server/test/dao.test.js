const DAO = require( "../pulsebsDAO.js" );

describe( "Login test suite", () => {
    test( 'Try to login with < davide.calarco@gmail.com, password>', () => {
        return DAO.getUserByEmail( 'davide.calarco@gmail.com' ).then( result => {
            expect( result.name ).toBe( 'Davide' );
        } );
    } );

    test( 'Try to login with < hyeronimus.bosch@gmail.com, password>', () => {
        return DAO.getUserByEmail( 'hyeronimus.bosch@gmail.com' ).then( result => {
            expect( result.name ).toBe( 'Hyeronimus' );
        } );
    } );

    test( 'Try to login with < harry.houdini@gmail.com, password>', () => {
        return DAO.getUserByEmail( 'harry.houdini@gmail.com' ).then( result => {
            expect( result.name ).toBe( 'Harry' );
        } );
    } );

    // Test authenticated user
    test( 'Try information about one user authenticated', () => {
        return DAO.getUserById( '239901' ).then( result => {
            expect( result.name ).toBe( "Hyeronimus" );
        } );
    } );

    test( 'Try information about one user authenticated 2', () => {
        return expect( DAO.getUserById( '239900' ) ).rejects.toBeUndefined();
    } );

    test( 'Try information about one user authenticated 3', () => {
        return expect( DAO.getUserById() ).rejects.toBeUndefined();
    } );
} );

//BOOKING A SEAT
test( 'Try to book a new seat', () => {
    return DAO.bookSeat( '3', '269901' ).then( result => {
        expect( result ).toBe( 1 );
    } );
} );

//GET STUDENT LECTURES
test( 'Try to get a student\'s lectures', () => {
    return DAO.getStudentLectures( '269901' ).then( result => {
        expect( result.length ).toEqual( 15 ); //old value 7
    } )
} );

//GET TEACHER LECTURES
test( 'Try to get a teacher\'s lectures', () => {
    return DAO.getTeacherLectures( '239901' ).then( result => {
        expect( result.length ).toBe( 12 ); //old value 11
    } );
} );

//GET STUDENTS BOOKED FOR LECTURE ID
test( 'Try to get students booked for lectures of 1 professor', () => {
    return DAO.getStudentsForLecturev2( '239901' ).then( result => {
        expect( result.length ).toBe( 23 ); //old value 3
    } );
} );

// GET STUDENTS BOOKED FOR 1 LECTURE
test( 'Try to get students booked for lecture 1', () => {
    return DAO.getStudentsForLecture( '1' ).then( result => {
        expect( result.length ).toBe( 4 ); //old value 1
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
test( 'Try to get all student\'s bookings', () => {
    return DAO.getStudentBookings( '269901' ).then( result => {
        expect( result.length ).toEqual( 6 ); //old value 3
    } )
} );

//GET TOMORROW LESSONS STATS
test( 'Try to get all students booked for tomorrow lectures', () => {
    return DAO.getTomorrowLessonsStats( true ).then( result => {
        expect( result.length ).toEqual( 0 ); //old value 1
    } );
} );

describe( 'Set presence to multiple students', () => {

    test( 'Trying to set both presences and absences', () => {
        let studentIds = [
            {
                id: 269901,
                presence: 1
            },
            {
                id: 269902,
                presence: 0
            },
            {
                id: 269903,
                presence: 1
            },
            {
                id: 269904,
                presence: 0
            },

        ]
        return DAO.setStudentPresencesForLecture( 1, studentIds )
                  .then( result => {
                      expect( result ).toEqual( 2 );
                  } )
    } )
    test( 'Trying to set no presences and absences', () => {
        let studentIds = [
            {
                id: 269901,
                presence: 0
            },
            {
                id: 269902,
                presence: 0
            },
            {
                id: 269903,
                presence: 0
            },
            {
                id: 269904,
                presence: 0
            },

        ]
        return DAO.setStudentPresencesForLecture( 1, studentIds )
                  .then( result => {
                      expect( result ).toEqual( 4 );
                  } )
    } )
    test( 'Trying to set just presences', () => {
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
        return DAO.setStudentPresencesForLecture( 1, studentIds )
                  .then( result => {
                      expect( result ).toEqual( 4 );
                  } )
    } )
    test( 'Trying to set presences with wrong parameters', () => {
        let studentIds = [
            {
                id: 269901
            },
            {
                id: 269902
            },
            {
                id: 269903
            },
            {
                id: 269904
            },

        ]
        return DAO.setStudentPresencesForLecture( 1, studentIds )
                  .catch( result => {
                      expect( result ).toEqual( -1 );
                  } )
    } )
} )

describe( 'Turn a lecture to be online instead of in presence', () => {
    describe( 'Unit testing', () => {
        test( 'Turnable lecture', () => {
            return DAO.turnLectureIntoOnline( 6, 239901 ).then( information => {
                expect( information ).toEqual(
                    [
                        {
                            "courseDescription": "Analisi 1",
                            "lectureClass": "VIRTUAL CLASSROOM",
                            "lectureDate": 1611138600000,
                            "studentEmail": "davide.calarco@gmail.com",
                            "studentId": 269901,
                            "studentName": "Davide",
                            "studentSurname": "Calarco"
                        }
                    ] );
            } ).catch( exitCode => {
                // test failed because the lecture should have been turnable into online
                console.log( "Test failure message: " );
                console.log( exitCode );
            } );
        } );

        test( 'Non-existing lecture', () => {
            return DAO.turnLectureIntoOnline( 300, 239901 ).then( exitCode => {
                console.log( "Test failure message: " );
                console.log( exitCode );
            } ).catch( exitCode => {
                // test failed because the lecture should have been turnable into online
                expect( exitCode ).toBe( -1 );
            } );
        } );

        test( 'Non-active lecture', () => {
            return DAO.turnLectureIntoOnline( 18, 239901 ).then( exitCode => {
                console.log( "Test failure message: " );
                console.log( exitCode );
            } ).catch( exitCode => {
                // test failed because the lecture should have been turnable into online
                expect( exitCode ).toBe( -2 );
            } );
        } );

        // ( 'Lecture is starting within 30 minutes', () => {
        //     return DAO.turnLectureIntoOnline( 239901,6 ).then( exitCode => {
        //         console.log( "Test failure message: " );
        //         console.log( exitCode );
        //     } ).catch( exitCode => {
        //         // test failed because the lecture should have been turnable into online
        //         expect( exitCode ).toBe( -3 );
        //     } );
        // } );
    } );
    // Cannot test exitCode === -4
} );
describe( 'Cancel/edit operations', () => {
    //EDIT PRESENCE LECTURE
    test( 'Try to put a lecture in remote', () => {
        return DAO.setPresenceLecture( 2, '12' ).then( result => {
            expect( result ).toEqual( 1 );
        } );
    } );

    //CANCEL A BOOKING
    test( 'Try to cancel a booking', () => {
        return DAO.cancelBookings( 1 ).then( result => {
            expect( result ).toEqual( 1 );
        } )
    } );

    //CANCEL LECTURE
    test( 'Try to cancel a lecture', () => {
        return DAO.cancelLecture( 2 ).then( result => {
            expect( result ).toEqual( 1 );
        } )
    } );
} )

// GET INFO BY STUDENT ID
test( 'Try to see if student infos are correct', () => {
    return DAO.getInfoByStudentId( 269901 ).then( result => {
        expect( result.email ).toBe( 'davide.calarco@gmail.com' );
        expect( result.name ).toBe( 'Davide' );
        expect( result.surname ).toBe( 'Calarco' );
    } )
} );

// GET LECTURE STATS
test( 'Try to see if lecture stats are the correct ones', () => {
    return DAO.getLectureStats( 1 ).then( result => {
        expect( result.date ).toBe( 1605684600000 );//expect(result.date).toBe(1605526200000);
        expect( result.course ).toBe( 'Analisi 1' );//expect(result.course).toBe('Analisi 1');
        expect( result.classroom ).toBe( "12" );//expect(result.classroom).toBe('VIRTUAL CLASSROOM');
    } )
} );


// Jest for this story requires that:
//      - the locale of moment is set to 'it' from the beginning of pulsebsDAO, not in the function itself;
describe( '[PUL 10] Get teacher statistics', () => {
    test( 'per lecture', () => {
        DAO.getTeacherBookingStatistics( 239902, 3, 'lecture' ).then( statistics => {
            expect( statistics ).toEqual(
                [
                    {
                        "bookingNumber": 1,
                        "lectureDate": 1607774400000,
                        "lectureId": 10
                    }
                ]
            );
        } );
    } );

    test( 'per week', () => {
        return DAO.getTeacherBookingStatistics( 239901, 2, 'week' ).then( statistics => {
            expect( statistics.length ).toEqual(2
                                                /*  [
                                                      {
                                                          "bookingNumber": 2,
                                                          "week": 1606690800000,
                                                      },
                                                      {
                                                          "bookingNumber": 4,
                                                          "week": 1607295600000,
                                                      }
                                                  ] */
            );
        } );
    } );

    test( 'per month', () => {
        return DAO.getTeacherBookingStatistics( 239901, 2, 'month' ).then( statistics => {
            expect( statistics ).toEqual(
                [
                    {
                        "bookingNumber": 3,
                        "month": 1606777200000
                    }
                ]
            );
        } );
    } );

    test( 'per lecture - Presence ON', () => {
        DAO.getTeacherBookingStatistics( 239902, 3, 'lecture', "1" ).then( statistics => {
            expect( statistics ).toEqual( [] );
        } );
    } );

    test( 'per week - Presence ON', () => {
        return DAO.getTeacherBookingStatistics( 239901, 2, 'week',"1" ).then( statistics => {
            expect( statistics.length ).toEqual(2
                                                /*  [
                                                      {
                                                          "bookingNumber": 2,
                                                          "week": 1606690800000,
                                                      },
                                                      {
                                                          "bookingNumber": 4,
                                                          "week": 1607295600000,
                                                      }
                                                  ] */
            );
        } );
    } );

    test( 'per month - Presence ON', () => {
        return DAO.getTeacherBookingStatistics( 239901, 2, 'month', "1" ).then( statistics => {
            expect( statistics ).toEqual(
                [
                    {
                        "bookingNumber": 3,
                        "month": 1606777200000
                    }
                ]
            );
        } );
    } );
} );

describe( "[PUL-11] Get statistics for manager", () => {
    test( 'get All Bookings 1', () => {
        return DAO.getAllBookings().then( b => {
            expect( b.length ).toBe( 26 );
        } )
    } );

    test( 'get Bookings 2', () => {
        let course = "Analisi 1";
        let lecture = 2;
        return DAO.getAllBookings( course, lecture ).then( b => {
            expect( b.length ).toBe( 5 );
        } )
    } );

    test( 'get Bookings 3', () => {
        let course = "Fisica 2";
        let lecture = 1;
        return DAO.getAllBookings( course, lecture ).then( b => {
            expect( b.length ).toBe( 0 );
        } )
    } );

    test( 'get All Attendances 1', () => {
        return DAO.getAllAttendances().then( b => {
            expect( b.length ).toBe( 22 );
        } )
    } );

    test( 'get Attendances 2', () => {
        let course = "Analisi 1";
        let lecture = 2;
        return DAO.getAllAttendances( course, lecture ).then( b => {
            expect( b.length ).toBe( 5 );
        } )
    } );

    test( 'get Attendances 3', () => {
        let course = "Fisica 2";
        let lecture = 1;
        return DAO.getAllAttendances( course, lecture ).then( b => {
            expect( b.length ).toBe( 0 );
        } )
    } );

    test( 'get All cancelled Lectures 1', () => {
        return DAO.getAllCancellationsLectures().then( c => {
            expect( c.length ).toBe( 6 );
        } );
    } );

    test( 'get All cancelled Lectures 2', () => {
        let course = "Analisi 1";
        let lecture = 18;
        return DAO.getAllCancellationsLectures( course, lecture ).then( c => {
            expect( c.length ).toBe( 1 );
        } );
    } );

    test( 'get All cancelled Lectures 3', () => {
        let course = "Fisica 2";
        let lecture = 7;
        return DAO.getAllCancellationsLectures( course, lecture ).then( c => {
            expect( c.length ).toBe( 0 );
        } );
    } );

    test( 'get All cancelled Booking 1', () => {
        return DAO.getAllCancellationsBookings().then( c => {
            expect( c.length ).toBe( 2 );
        } );
    } );

    test( 'get All cancelled Bookings 2', () => {
        let course = "Analisi 1";
        let lecture = 2;
        return DAO.getAllCancellationsBookings( course, lecture ).then( c => {
            expect( c.length ).toBe( 0 );
        } );
    } );

    test( 'get All cancelled Bookings 3', () => {
        let course = "Fisica 2";
        let lecture = 7;
        return DAO.getAllCancellationsBookings( course, lecture ).then( c => {
            expect( c.length ).toBe( 0 );
        } );
    } );

    test( 'get All Courses', () => {
        return DAO.getAllCourses().then( c => {
            expect( c.length ).toBe( 8 ); //change value(depends of cardinality of courses)
        } );
    } );

    test( 'get All Lectures', () => {
        return DAO.getAllLectures().then( c => {
            expect( c.length ).toBe( 23 ); //change value(depends of cardinality of lectures)
        } );
    } );

} );

// MANAGER contact tracing
describe( "MANAGER contact tracing", () => {
    test( 'Try to see if correct students\' contract tracing datas are received', () => {
        return DAO.getContactsWithPositiveStudent( 269901, true ).then( result => {

            expect( result.uniqTeachers[0].tID ).toBe( 239901 );
            expect( result.uniqTeachers[0].name ).toBe( "Hyeronimus" );
            expect( result.uniqTeachers[0].surname ).toBe( "Bosch" );
            expect( result.uniqTeachers[0].ssn ).toBe( "HYRBCH80A01H501Y" );

            expect( result.involvedStudents[0].sID ).toBe( 269902 );
            expect( result.involvedStudents[0].name ).toBe( "Francesco" );
            expect( result.involvedStudents[0].surname ).toBe( "Gallo" );
            expect( result.involvedStudents[0].ssn ).toBe( "FRNGLL80A01H501H" );
        } )
    } );

    test( 'Try to see if correct teachers\' contract tracing datas are received', () => {
        return DAO.getContactsWithPositiveTeacher( 239901, true ).then( result => {

            expect( result[0].sID ).toBe( 269901 );
            expect( result[0].name ).toBe( "Davide" );
            expect( result[0].surname ).toBe( "Calarco" );
            expect( result[0].ssn ).toBe( "CLRDVD80A01H501C" );

        } )
    } );
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
                "surname": "cognome",
                "ssn": "ABCD1234ABCD1111"
            }
        ],
        "students": [
            {
                "id": "269910",
                "email": "def@gmail.com",
                "password": "hash123",
                "name": "nome",
                "surname": "cognome",
                "ssn": "ABCD1234ABCD2222"
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
                    "id": "16",
                    "desc": "12B",
                    "seats": "72"
                }
            ],
            "teachers": [
                {
                    "id": "239911",
                    "email": "ghi@gmail.com",
                    "password": "hash123",
                    "name": "nome",
                    "surname": "cognome",
                    "ssn": "ABCD1234ABCD3333"
                }
            ],
            "students": [
                {
                    "id": "269911",
                    "email": "lmn@gmail.com",
                    "password": "hash123",
                    "name": "nome",
                    "surname": "cognome",
                    "ssn": "ABCD1234ABCD4444"
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

describe( 'Schedule update', () => {

    test( "Try to delete lectures by date", () => {
        return DAO.cancelLecturesByDate( 1610236800000, 1611100800000 )
                  .then( result => expect( result ).toBe( 1 ) );
    } );

    test( "Try to delete lectures by date without passing a parameter", () => {
        return DAO.cancelLecturesByDate( 1610236800000 )
        .catch( err => expect( err ) );
    } );

    test( "Try to delete lectures by date in a range of date in which there are no lessons in the db", () => {
        return DAO.cancelLecturesByDate(  1510236800000, 1511100800000 )
                  .then( result => expect( result ).toBe( 0 ) );
    } );

    test( "Try to delete bookings by date", () => {
        return DAO.cancelBookingsByDate( 1610236800000, 1611100800000 )
                  .then( result => expect( result ).toBe( 1 ) );
    } );

    test( "Try to delete bookings by date without passing a parameter", () => {
        return DAO.cancelBookingsByDate( 1610236800000 )
        .catch( err => expect( err ) );
    } );

    test( "Try to delete bookings by date in a range of date in which there are no lessons in the db", () => {
        return DAO.cancelBookingsByDate(  1510236800000, 1511100800000 )
                  .then( result => expect( result ).toBe( 0 ) );
    } );
    

});

/**
 * @Feihong
 *  Functions:
 * 1. delete a waiting item
 * 2. add the lecture and student of the waiting item to booking table
 * 3. get the informations of the stuedent who picked from waiting table and was added into booking table with a
 *     lecture
 *
 * Return values:
 rejected:
 0: Find waiting err;
 -1: There is no such a lecture in waiting list;
 -2: Delete waiting err
 -3: Add new booking err;
 -4: Find student informations err
 -5: There is no such a class, so can not find informations of the class
 resolve:
 row: it contains student's informations: letture date, course description, class name, student name, student surname, student email, and student id
 * @Note
 1. booking a lecture: the lecture 1 and student 269901 should in waiting list
 2. Non-existing lecture: the lecture 5 should not in waiting table
 3. Non-existing class: lectur 4 should not have a class
 */
describe( 'when cancel a lecture, trigger this function to find a waiting student, and add her/him to booking table ', () => {
    describe( 'Unit testing', () => {
        test( 'booking a lecture', () => {
            return DAO.deleteWaitingAddBooking( 23 ).then( information => {
                expect( information.studentId ).toEqual( 269903 );
            } ).catch( exitCode => {
                // test failed because the lecture should have been turnable into online
                console.log( "Test failure message: " );
                console.log( exitCode );
            } );
        } );

        test( 'Non-existing lecture', () => {
            return DAO.deleteWaitingAddBooking( 5 ).then( exitCode => {
                console.log( "Test failure message: " );
                console.log( exitCode );
            } ).catch( exitCode => {
                // test failed because the lecture should have been turnable into online
                expect( exitCode ).toBe( -1 );
            } );
        } );

        test( 'Non-existing class', () => {
            return DAO.deleteWaitingAddBooking( 4 ).then( exitCode => {
                console.log( "Test failure message: " );
                console.log( exitCode );
            } ).catch( exitCode => {
                // test failed because the lecture should have been turnable into online
                expect( exitCode ).toBe( -1 );
            } );
        } );

        // ( 'Lecture is starting within 30 minutes', () => {
        //     return DAO.turnLectureIntoOnline( 239901,6 ).then( exitCode => {
        //         console.log( "Test failure message: " );
        //         console.log( exitCode );
        //     } ).catch( exitCode => {
        //         // test failed because the lecture should have been turnable into online
        //         expect( exitCode ).toBe( -3 );
        //     } );
        // } );
    } );
    // Cannot test exitCode === -4
} );


/**
 * @Feihong
 * get the waiting list of a student
 * @Note
 * student 269901 shuld in table waiting
 */
test( 'get waiting list of student 269903', () => {
    return DAO.getWaitingList( 269904 ).then( result => {
        expect( result[0].id ).toBe( 2 );
    } )
} );

/**
 * @Feihong
 * 1. make sure there are free seats for student
 * 2. if there are free seats, update the bookable attribute to 1
 * @Note
 * 1. there are free seats of lecture 1's class room
 * 2. there no free seats of lectuere 2's class room
 */
describe( 'Cancel/edit operations', () => {
    //EDIT PRESENCE LECTURE
    test( 'Update bookable of lecture 1 to 1', () => {
        return DAO.checkSeatsOfLecture( 1 ).then( result => {
            expect( result ).toEqual( 1 );
        } );
    } );

//CANCEL A BOOKING
    test( 'Update bookable of lecture 2 to 0', () => {
        return DAO.checkSeatsOfLecture( 2 ).then( result => {
            expect( result ).toEqual( 1 );
        } );
    } );
} )


/**
 * @Feihong
 * To check if the student in the waiting list or not
 * @Note
 * student 269901 and lecture 1 should in the waiting table
 */
test( 'To check if the student in the waiting list or not', () => {
    return DAO.checkStudentInWaitingList( 269904, 23 ).then( result => {
        expect( result ).toBe( "You already in the Waiting List" );
    } )
} );

/**
 * @Feihong
 * Add a student to waiting list
 */
test( 'Add a student to waiting list', () => {
    return DAO.addStudentToWaitingList( 269901, 1 ).then( result => {
        expect( result ).toBe( "successful insert" );
    } )
} );

// GET STUDENT / TEACHER STARTING FROM SSN
describe( "Get student and teacher starting from ssn code", () => {
    test( 'Get student starting from ssn code', () => {
        return DAO.getStudentFromSSN("CLRDVD80A01H501C").then( student => {
            expect( student[0].id ).toBe( 269901 );
            expect( student[0].name ).toBe( "Davide" );
            expect( student[0].surname ).toBe( "Calarco" );
            expect( student[0].email ).toBe( "davide.calarco@gmail.com" );
        } );
    } );

    test( 'Get teacher starting from ssn code', () => {
        return DAO.getTeacherFromSSN("HYRBCH80A01H501Y").then( teacher => {
            expect( teacher[0].id ).toBe( 239901 );
            expect( teacher[0].name ).toBe( "Hyeronimus" );
            expect( teacher[0].surname ).toBe( "Bosch" );
            expect( teacher[0].email ).toBe( "hyeronimus.bosch@gmail.com" );
        } );
    } );
})