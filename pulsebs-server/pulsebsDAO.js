const sqlite3 = require( 'sqlite3' ).verbose();
const fs = require( 'fs' );
const moment = require( 'moment' );

const User = require( './User' );

let db;

function openDB (dbName) {
    return new sqlite3.Database( dbName, ( err ) => {
        if ( err ) return console.error( err.message );
    } );
}

/*
* Database Connection
*/
if ( !db ) {
    if ( process.env.TEST && process.env.TEST === '1' ) {
        //TEST DB
        const dbName = 'pulsebs-test.db'
        //Check for file existance
        if ( fs.existsSync( dbName ) ) fs.unlinkSync( dbName ); //If true, delete file
        //Create new db
        fs.copyFile('pulsebs-backup.db', 'pulsebs-test.db', (err) => {
            if (err) throw err;
        });
        db = openDB(dbName);
    } else db = openDB('pulsebs.db');
}

/*
* DAO Methods
*/

/*
* Checking user password
* */

exports.getUserByEmail = function ( email ) {
    return new Promise( ( resolve, reject ) => {
        let nTimesUserNotFound = 0;

        let sqls = [ `SELECT * FROM student WHERE email = ?`,
                `SELECT * FROM teacher WHERE email = ?`,
                `SELECT * FROM staff WHERE email = ?` ];

        for ( let i = 0; i < sqls.length; i++ ) {
            db.all( sqls[i], [ email ], ( err, rows ) => {
                if ( err ) {
                    reject( err );
                } else if ( rows.length === 0 ) {
                    // if none query succeeds, the email doesn't exist anywhere in the DB
                    nTimesUserNotFound++;
                    if ( nTimesUserNotFound === 3 ) reject( undefined );
                    // email doesn't belong to a type-i user
                } else {
                    let row = rows[0];
                    const user = new User( row.id, row.email, row.password, i, row.name, row.surname );
                    resolve( user );
                }
            } );
        }

    } );
};


/*
* Get the email for each student provided
*
* Comment on the implementation:
*   The function could have been implemented to perform one query per studentId, but it would have been slow;
*   Another solution could have been to parallelize queries, each one searching for a studentId, but Node is single-threaded so the
*       function db.parallelize has no increased performance if a single thread executes it;
*   The current implementation extracts all ids and emails from the table and performs the selection in JS.
*/

exports.getLectureInformation = function ( lectureId ) {
    return new Promise( ( ( resolve, reject ) => {
        let query = 'SELECT id, ref_course AS courseId, ref_class AS classId FROM student;'
        db.all( query, [ lectureId ], ( error, rows ) => {
            if ( error ) reject( error );
            else if ( !rows ) resolve( [] );
            else resolve( rows.filter( row => studentIds.includes( row.id ) ).map( row => row.email ) );
        } );
    } ) );
}

/*
* Get email by userId
* */

exports.getInfoByStudentId = ( studentId ) => {
    return new Promise( ( ( resolve, reject ) => {
        let query = `SELECT email,
                            name,
                            surname
                    FROM student
                    WHERE id=${ studentId };`
        db.all( query, [], ( err, rows ) => {
            if ( err ) reject( err );
            if ( rows ) resolve( rows[0] );
            else resolve( 0 );
        } );
    } ) );
}

/*
* Retrieve info about id
* */

exports.getUserById = function ( id ) {
    return new Promise( ( resolve, reject ) => {
        let nTimesUserNotFound = 0;

        let sqls = [ `SELECT * FROM student WHERE id = ?`,
                `SELECT * FROM teacher WHERE id = ?`,
                `SELECT * FROM staff WHERE id = ?` ];

        for ( let i = 0; i < sqls.length; i++ ) {
            db.all( sqls[i], [ id ], ( err, rows ) => {
                if ( err ) {
                    reject( err );
                } else if ( rows.length === 0 ) {
                    // if none query succeeds, the email doesn't exist anywhere in the DB
                    nTimesUserNotFound++;
                    if ( nTimesUserNotFound === 3 ) reject( undefined );
                    // email doesn't belong to a type-i user
                } else {
                    let row = rows[0];
                    const user = new User( row.id, row.email, row.password, i, row.name, row.surname );
                    resolve( user );
                }
            } );
        }

    } );
};

/*
* Book a seat for a lecture
* */

exports.bookSeat = ( lectureId, studentId ) => {
    return new Promise( ( ( resolve, reject ) => {
        //1 - Check if student is undersigned to that course
        let checkQuery = `SELECT bookable
                          FROM subscription S,course C,lecture L
                          WHERE S.ref_course = C.id AND
                                C.id = L.ref_course AND
                                L.id = ${ lectureId } AND
                                S.ref_student = ${ studentId };`
        //2 - Insert a new booking record
        let bookQuery = `INSERT INTO booking (ref_student,ref_lecture,date) VALUES ( ${ studentId },${ lectureId },${ moment().valueOf() });`

        db.get( checkQuery, [], ( err, row ) => {
            if ( err ) reject( err );
            if ( row && row.bookable === 1 ) {
                //Student subscription exists

                db.run( bookQuery, [], ( err ) => {

                    err ? reject( err ) : resolve( 1 );
                } );
            } else resolve( 0 );
        } );
    } ) );
}

/*
* Get lecture statistics
* */

exports.getLectureStats = ( lectureId ) => {
    return new Promise( ( ( resolve, reject ) => {
        let query = `SELECT date,
                            CO.desc AS course,
                            CL.desc AS classroom
                       FROM lecture L,
                            class CL,
                            course CO
                       WHERE L.ref_class = CL.id AND
                             L.ref_course = CO.id AND
                             L.id = ${ lectureId };`
        db.all( query, [], ( err, rows ) => {
            if ( err ) reject( err );
            if ( rows ) resolve( rows[0] );
            else resolve( 0 );
        } );
    } ) );
}


/*
* Get list of student's lectures
* */

exports.getStudentLectures = ( studentId ) => {
    return new Promise( ( ( resolve, reject ) => {
        let query = `SELECT L.id,
                            date,
                            presence,
                            bookable,
                            active,
                            C.desc as course,
                            name,
                            surname,
                            Cl.desc as class
                      FROM lecture L,
                           course C,
                           teacher T,
                           class CL
                      WHERE L.ref_course = C.id AND
                            L.ref_class = CL.id AND
                            C.ref_teacher = T.id AND
                            C.id IN (   SELECT  C2.id
                                        FROM    subscription S, student ST, course C2
                                        WHERE   S.ref_course = C2.id AND
                                                S.ref_student = ${ studentId }
                            );`
        db.all( query, [], ( err, rows ) => {
            if ( err ) reject( err );
            if ( rows ) resolve( rows );
            else resolve( 0 );
        } );
    } ) );
}

/*
* Get list of teacher's lectures
* */

exports.getTeacherLectures = ( teacherId ) => {
    return new Promise( ( ( resolve, reject ) => {
        let query = `SELECT C.desc as course,
                                CL.desc as class,
                                C.id as id,
                                L.id as lecId,
                                L.date,
                                L.endTime,
                                L.presence,
                                L.bookable,
                                L.active
                        FROM    lecture L,
                                course C,
                                class CL
                        WHERE   L.ref_course = C.id AND
                                L.ref_class = CL.id AND
                                C.ref_teacher = ${ teacherId };`
        db.all( query, [], ( err, rows ) => {
            if ( err ) reject( err );
            if ( rows ) resolve( rows );
            else resolve( 0 );
        } );
    } ) );
}

/*
* Get a list of students who will attend a lecture
* */
exports.getStudentsForLecture = (lectureId) => {
    return new Promise(((resolve, reject) => {
        let query = `SELECT S.id,S.email,S.name,S.surname FROM booking B, student S WHERE B.ref_student=S.id AND B.ref_lecture = ${lectureId};`
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
            else resolve(0);
        });
    }));
}


/*
* Get a list of students who will attend a lecture - Vincenzo's implementation
* */

exports.getStudentsForLecturev2 = ( teacherId ) => {
    return new Promise( ( ( resolve, reject ) => {
        let query = `SELECT DISTINCT B.ref_student as studentId,B.ref_lecture as lId
                     FROM booking B,course CO, lecture L
                     WHERE B.ref_lecture=L.id AND L.ref_course=CO.id AND CO.ref_teacher=${ teacherId };`
        db.all( query, [], ( err, rows ) => {
            if ( err ) reject( err );
            if ( rows ) resolve( rows );
            else resolve( 0 );
        } );
    } ) );
}


/*
* Delete a booking
* */

exports.cancelBookings = ( bookingId ) => {
    return new Promise( ( ( resolve, reject ) => {
        let query = `UPDATE booking SET active = 0 WHERE id = ${ bookingId };`
        db.run( query, [], function ( err ) {
            if ( err ) reject( err );
            if ( this.changes ) resolve( 1 );
            else resolve( 0 );
        } );
    } ) );
}

/*
* Delete a booking  -v2
* */

exports.cancelBooking = ( bookingId ) => {
    return new Promise( ( ( resolve, reject ) => {
        let query = `DELETE FROM booking WHERE id = ${ bookingId };`
        db.run( query, [], function ( err ) {
            if ( err ) reject( err );
            if ( this.changes ) resolve( 1 );
            else resolve( 0 );
        } );
    } ) );
}


/*
* Get a list of student's booking
* */

exports.getStudentBookings = ( studentId ) => {
    return new Promise( ( ( resolve, reject ) => {
        let query = `   SELECT  B.id,
                                B.date,
                                B.active,
                                B.presence,
                                B.ref_lecture,
                                L.date,
                                L.presence,
                                L.active,
                                C.desc as course,
                                Cl.desc as class,
                                seats,
                                name,
                                surname
                        FROM    booking B,
                                lecture L,
                                course C,
                                class CL,
                                teacher T
                        WHERE   B.ref_lecture = L.id AND
                                L.ref_class = CL.id AND
                                L.ref_course = C.id AND
                                C.ref_teacher = T.id AND
                                B.ref_student = ${ studentId };`
        db.all( query, [], ( err, rows ) => {
            if ( err ) reject( err );
            if ( rows ) resolve( rows );
            else resolve( 0 );
        } );
    } ) );
}

/*
* Delete a lecture
* */

exports.cancelLecture = ( lectureId ) => {
    return new Promise( ( ( resolve, reject ) => {
        let query = `UPDATE lecture SET active = 0, bookable = 0 WHERE id = ${ lectureId };`
        db.run( query, [], function ( err ) {
            if ( err ) reject( err );
            if ( this.changes ) resolve( 1 );
            else resolve( 0 );
        } );
    } ) );
}

/*
* Get tomorrow's lessons stats
* */

exports.getTomorrowLessonsStats = ( test = false ) => {
    return new Promise( ( ( resolve, reject ) => {
        let query = `    SELECT T.id,
                                T.email,
                                T.name,
                                T.surname,
                                C.desc,
                                CL.desc AS class,
                                COUNT(B.ref_student) AS nStudents
                        FROM    teacher T,
                                course C,
                                lecture L,
                                booking B,
                                class CL
                        WHERE   T.id = C.ref_teacher AND
                                C.id = L.ref_course AND
                                B.ref_lecture = L.id AND
                                B.active = 1 AND
                                L.active = 1 AND
                                L.date > ${ test ? 1605398400000 : moment().milliseconds( 0 )
                                                                           .seconds( 0 )
                                                                           .minute( 0 )
                                                                           .hour( 0 )
                                                                           .add( 1, "day" )
                                                                           .valueOf() } AND
                                L.date < ${ test ? 1605571199000 : moment().milliseconds( 0 )
                                                                           .seconds( 0 )
                                                                           .minute( 0 )
                                                                           .hour( 0 )
                                                                           .add( 2, "days" )
                                                                           .valueOf() } AND
                                CL.id = L.ref_class
                        GROUP BY B.ref_lecture;`
        db.all( query, [], ( err, rows ) => {
            if ( err ) reject( err );
            else if ( rows ) resolve( rows );
            else resolve( 0 );
        } );
    } ) );
}


/*
* Turn a presence and active lecture into an online one
*
* Return values:
    rejected:
        0: the modification has been correctly performed;
        -1: no lecture exists with the specified lectureId;
        -2: the selected lecture with lectureId cannot be modified because
            it is not active;
        -3: the selected lecture with lectureId cannot be modified because
            the lecture is starting within 30 minutes as of now;
        -4: internal error;
*   resolved:
*
*
* Comments:
*   this method executes two queries turning the lecture as online only for allowing
*   to distinguish whether the eventual mismatch has occured because either the lecture
*   is not active or if the lecture's start time is planned within the next
*   30 minutes starting from the current time
* */
exports.turnLectureIntoOnline = ( teacherId = 0, lectureId ) => {
    return new Promise( ( resolve, reject ) => {
        let query1 = `  SELECT  L.active as active, L.date as date
                        FROM lecture L, course C
                        WHERE L.ref_course = C.id AND L.id = ${lectureId} AND C.ref_teacher = ${teacherId}`;
        let query2 = `UPDATE lecture SET presence = 0, ref_class = 0 WHERE id = ${lectureId} AND active = 1;`
        let now = moment().valueOf(); // in milliseconds

        db.get( query1, [], function ( error, couple ) {
            if ( couple === undefined ) {
                reject( -1 );
            } else if ( couple.active === 0 ) {
                reject( -2 );
            } else if ( now > couple.date - 1800000 && now < couple.date ) {
                reject( -3 );
            } else if ( error ) {
                reject( -4 );
            } else {
                db.run( query2, [], function ( error ) {
                    if ( error ) {
                        reject( -4 );
                    } else {
                        let getInformationToSendEmailsQuery =
                                `SELECT DISTINCT L.date AS lectureDate,
                                    Co.desc AS courseDescription,
                                    Cl.desc AS lectureClass,
                                    S.name AS studentName,
                                    S.surname AS studentSurname,
                                    S.id AS studentId,
                                    S.email AS studentEmail
                            FROM    booking B,
                                    student S,
                                    lecture L,
                                    course Co,
                                    class Cl
                            WHERE   L.id = ${lectureId} AND
                                    B.ref_student = S.id AND
                                    B.ref_lecture = L.id AND
                                    L.ref_course = Co.id AND
                                    L.ref_class = Cl.id`;
                        db.all( getInformationToSendEmailsQuery, [], function ( error, rows ) {
                            if ( error ) reject( -4 );
                            else resolve( rows );
                        } );
                    }
                } );
            }
        } );

    } );
}


/*
* Get all bookings to be grouped by week,month or single lecture
* Time handling should be done on frontend due to a too simple handling of date format in sqlite
* */

exports.getTeacherBookingStats = ( teacherId ) => {
    return new Promise( ( ( resolve, reject ) => {
        let query = `SELECT B.id,
                            B.date as bDate,
                            B.active,
                            B.presence,
                            L.date as Ldate,
                            L.presence as lPresence,
                            L.active as lActive,
                            C.desc
                     FROM   booking B,
                            lecture L,
                            course C
                     WHERE  B.ref_lecture = L.id AND
                            L.ref_course = C.id AND
                            C.ref_teacher = ${ teacherId } AND
                            active = 1;`
        db.all( query, [], ( err, rows ) => {
            if ( err ) reject( err );
            if ( rows ) resolve( rows );
            else resolve( 0 );
        } );
    } ) );
}

/*
* Get all presence grouped by week,month or single lecture
* Time handling should be done on frontend due to a too simple handling of date format in sqlite
* */

exports.getTeacherPresenceStats = ( teacherId ) => {
    return new Promise( ( ( resolve, reject ) => {
        let query = `    SELECT *
                         FROM   booking B,
                                lecture L,
                                course C
                         WHERE  B.ref_lecture = L.id AND
                                L.ref_course = C.id AND
                                C.ref_teacher = ${ teacherId } AND
                                active = 1 AND
                                presence = 1 AND
                                L.date < ${ moment().valueOf() };`
        db.all( query, [], ( err, rows ) => {
            if ( err ) reject( err );
            if ( rows ) resolve( rows );
            else resolve( 0 );
        } );
    } ) );
}

/*
* Get the total of bookings, cancellations and attendances of the system
* */

exports.getManagerStats = () => {
    return new Promise( ( ( resolve, reject ) => {
        //Result => [ BOOKING COUNT, CANCELLATION COUNT, PRESENCE COUNT ]
        let query = `SELECT COUNT(*) FROM booking WHERE active = 1 UNION ALL
                     SELECT COUNT(*) FROM booking WHERE active = 0 UNION ALL
                     SELECT COUNT(*) FROM booking WHERE presence = 1;`
        db.all( query, [], ( err, rows ) => {
            if ( err ) reject( err );
            if ( rows ) resolve( rows );
            else resolve( 0 );
        } );
    } ) );
}

/*
* Get all attendance of a positive student and the relative people involved in
* */

exports.studentContactTracing = ( studentId ) => {
    return new Promise( ( ( resolve, reject ) => {
        let now = moment();
        let twoWeeksAgo = now.subtract( 14, 'days' );

        let query = `SELECT S.name as sname,
                            S.surname as ssurname,
                            T.name as tname,
                            T.surname as tsurname
                     FROM   booking B,
                            lecture L,
                            student S,
                            course C,
                            teacher T
                     WHERE  B.ref_student = S.id AND
                            B.ref_lecture = L.id AND
                            L.ref_course = C.id AND
                            C.ref_teacher = T.id AND
                            B.id IN (   SELECT  B.id
                                        FROM    booking B,
                                                lecture L
                                        WHERE   B.ref_lecture = L.lecture AND
                                                B.ref_student = ${ studentId } AND
                                                B.presence = 1 AND
                                                L.date < ${ now.valueOf() } AND
                                                L.date > ${ twoWeeksAgo.valueOf() } );`
        db.all( query, [], ( err, rows ) => {
            if ( err ) reject( err );
            if ( rows ) resolve( rows );
            else resolve( 0 );
        } );
    } ) );
}

/*
* Get all lectures of a positive teacher and the relative people involved in
* */

exports.teacherContactTracing = ( teacherId ) => {
    return new Promise( ( ( resolve, reject ) => {
        let now = moment();
        let twoWeeksAgo = now.subtract( 14, 'days' );

        let query = `SELECT S.name as sname,
                            S.surname as ssurname
                     FROM   booking B,
                            lecture L,
                            student S,
                            course C
                     WHERE  B.ref_student = S.id AND
                            B.ref_lecture = L.id AND
                            L.ref_course = C.id AND
                            C.ref_teacher = ${ teacherId } AND
                            B.presence = 1 AND
                            L.date < ${ now.valueOf() } AND
                            L.date > ${ twoWeeksAgo.valueOf() };`
        db.all( query, [], ( err, rows ) => {
            if ( err ) reject( err );
            if ( rows ) resolve( rows );
            else resolve( 0 );
        } );
    } ) );
}

/*
* Make bookable/no bookable a lecture
* */

exports.editBookableLecture = ( lectureId, bookable ) => {
    return new Promise( ( ( resolve, reject ) => {
        let query = `UPDATE lecture SET bookable = ${ bookable } WHERE id = ${ lectureId };`
        db.run( query, [], function ( err ) {
            if ( err ) reject( err );
            if ( this.changes ) resolve( 1 );
            else resolve( 0 );
        } );
    } ) );
}

/*
* Get all courses, with relative lectures anda dates
* */

exports.getOfficerCoursesLectures = () => {
    return new Promise( ( ( resolve, reject ) => {
        let query = `SELECT * FROM lecture L, course C WHERE L.ref_course = C.id;`
        db.all( query, [], ( err, rows ) => {
            if ( err ) reject( err );
            if ( rows ) resolve( rows );
            else resolve( 0 );
        } );
    } ) );
}

/*
* Edit a lecture date
* */

exports.editLectureDate = ( lectureId, newDate ) => {
    return new Promise( ( ( resolve, reject ) => {
        let query = `UPDATE lecture SET date = ${ newDate } WHERE id = ${ lectureId };`
        db.run( query, [], function ( err ) {
            if ( err ) reject( err );
            if ( this.changes ) resolve( 1 );
            else resolve( 0 );
        } );
    } ) );
}

exports.setPresenceLecture = ( lectureId, className ) => {
    return new Promise( ( ( resolve, reject ) => {
        let queryClass = `SELECT id FROM class WHERE desc = ${ className }`;
        let queryLecture = `UPDATE lecture SET presence = 1, ref_class = ? WHERE id = ${ lectureId }`;
        db.get( queryClass, [], ( err, row ) => {
            if ( err ) reject( err );
            if ( row ) {
                db.run( queryLecture, [ row.id ], ( err ) => {
                    if ( err ) reject( err );
                    else resolve( 1 );
                } )
            }
        } )
    } ) );

}
