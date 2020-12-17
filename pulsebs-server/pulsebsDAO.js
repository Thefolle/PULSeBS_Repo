const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const moment = require('moment');
const { resolve } = require('path');
moment.locale('it');

const User = require('./User');

let db;

function openDB(dbName) {
    return new sqlite3.Database(dbName, (err) => {
        if (err) return console.error(err.message);
    });
}

/*
* Database Connection
*/
if (!db) {
    if (process.env.TEST && process.env.TEST === '1') {
        //TEST DB
        const dbName = 'pulsebs-test.db'
        //Check for file existance
        if (fs.existsSync(dbName)) fs.unlinkSync(dbName); //If true, delete file
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

exports.getUserByEmail = function (email) {
    return new Promise((resolve, reject) => {
        let nTimesUserNotFound = 0;

        let sqls = [`SELECT * FROM student WHERE email = ?`,
            `SELECT * FROM teacher WHERE email = ?`,
            `SELECT * FROM staff WHERE email = ?`];

        for (let i = 0; i < sqls.length; i++) {
            db.all(sqls[i], [email], (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length === 0) {
                    // if none query succeeds, the email doesn't exist anywhere in the DB
                    nTimesUserNotFound++;
                    if (nTimesUserNotFound === 3) reject(undefined);
                    // email doesn't belong to a type-i user
                } else {
                    let row = rows[0];
                    let user;
                    //Booking Manager and Staff officer have data in same table but they have different types(0,1) so add this value at 2 that identifies staff
                    if(i===2){
                        user = new User(row.id, row.email, row.password, i+parseInt(row.type), row.name, row.surname);
                    }else{
                        user = new User(row.id, row.email, row.password, i, row.name, row.surname);
                    }

                    resolve(user);
                }
            });
        }

    });
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

exports.getLectureInformation = function (lectureId) {
    return new Promise(((resolve, reject) => {
        let query = 'SELECT id, ref_course AS courseId, ref_class AS classId FROM student;'
        db.all(query, [lectureId], (error, rows) => {
            if (error) reject(error);
            else if (!rows) resolve([]);
            else resolve(rows.filter(row => studentIds.includes(row.id)).map(row => row.email));
        });
    }));
}

/*
* Get email by userId
* */

exports.getInfoByStudentId = (studentId) => {
    return new Promise(((resolve, reject) => {
        let query = `SELECT email,
                            name,
                            surname
                    FROM student
                    WHERE id=${studentId};`
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows[0]);
            else resolve(0);
        });
    }));
}

/*
* Retrieve info about id
* */

exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        let nTimesUserNotFound = 0;

        let sqls = [`SELECT * FROM student WHERE id = ?`,
            `SELECT * FROM teacher WHERE id = ?`,
            `SELECT * FROM staff WHERE id = ?`];

        for (let i = 0; i < sqls.length; i++) {
            db.all(sqls[i], [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length === 0) {
                    // if none query succeeds, the email doesn't exist anywhere in the DB
                    nTimesUserNotFound++;
                    if (nTimesUserNotFound === 3) reject(undefined);
                    // email doesn't belong to a type-i user
                } else {
                    let row = rows[0];
                    let user;
                    //Booking Manager and Staff officer have data in same table but they have different types(0,1) so add this value at 2 that identifies staff
                    if(i===2){
                        user = new User(row.id, row.email, row.password, i+parseInt(row.type), row.name, row.surname);
                    }else{
                        user = new User(row.id, row.email, row.password, i, row.name, row.surname);
                    }

                    resolve(user);
                }
            });
        }

    });
};

/*
* Book a seat for a lecture
* */

exports.bookSeat = (lectureId, studentId) => {
    return new Promise(((resolve, reject) => {
        //1 - Check if student is undersigned to that course
        let checkQuery = `SELECT bookable
                          FROM subscription S,course C,lecture L
                          WHERE S.ref_course = C.id AND
                                C.id = L.ref_course AND
                                L.id = ${lectureId} AND
                                S.ref_student = ${studentId};`
        //2 - Insert a new booking record
        let bookQuery = `INSERT INTO booking (ref_student,ref_lecture,date) VALUES ( ${studentId},${lectureId},${moment().valueOf()});`
        let existBookingQuery = `SELECT id FROM booking B WHERE B.ref_lecture = ${lectureId} AND ref_student = ${studentId}`;

        db.get(checkQuery, [], (err1, row1) => {
            if (err1) reject(err1);
            if (row1 && row1.bookable === 1) {
                //Student subscription exists
                db.get(existBookingQuery, [], (err2,row2) => {
                    if (err2) reject(err2);
                    if (row2) {
                        //Booking exist, and it should be updated
                        let updateBookingQuery = `UPDATE booking SET active = 1 WHERE id = ${row2.id}`;
                        db.run(updateBookingQuery, [], (err3) => {
                            err3 ? reject(err3) : resolve(1);
                        })
                    }else{
                        //Booking doesn't exist, and it should be created as a new one
                        db.run(bookQuery,[],(err3) => {
                            err3 ? reject(err3) : resolve(1);
                        })
                    }
                });
            } else resolve(0);
        });
    }));
}

/**
 * @Feihong
 * @param {*} bookingId 
 * Update a booking
 */
// FIXME: to fix get bookings method 
exports.cancelBooking = ( bookingId ) => {
    return new Promise( ( ( resolve, reject ) => {
        let query = `UPDATE booking SET active = 0 WHERE id = ${ bookingId };`
        db.run( query, [], function ( err ) {
            if ( err ) reject( err );
            if ( this.changes ) {

                resolve( 1 );
            } 
            else resolve( 0 );
        } );
    } ) );
}

/**
 * @Feihong
 * Add a student to waiting list
 * @param {*} lectureId 
 */
 exports.addStudentToWaitingList = (studentId, lectureId) => {
     return new Promise( ( (resolve, reject) =>{
        let addToWaiting = `INSERT INTO waiting(ref_student, ref_lecture, date) VALUES ( ${studentId}, ${lectureId}, ${ moment().valueOf()})`
        db.run(addToWaiting, [], (err) => {
            err ? reject("DB problem") : resolve("successful insert");
        })
     } ) )
 }

 /**
  * @Feihong
  * @param {*} lectureId 
  */

exports.checkStudentInWaitingList = (studentId, lectureId) => {
    return new Promise( ( (resolve, reject) => {
        let checkWaiting = `SELECT ref_student FROM waiting WHERE ref_student = ${studentId} And ref_lecture = ${lectureId}`
        db.all( checkWaiting, [], (err, row) => {
            if(err) reject(-1);
            if (row){
                resolve("You already in the Waiting List");
            } else {
                resolve(0);
            }
        })
    }))
}


/**
 * @Feihong 
 * @param {*} lectureId 
 * Functions:
 * 1. make sure there are free seats for student
 * 2. if there are free seats, update the bookable attribute to 1
 */

exports.checkSeatsOfLecture = (lectureId) => {
    return new Promise (((resolve, reject) =>{
        let upadteLecture = `UPDATE lecture SET bookable = 1 WHERE id = ${lectureId}`
        let upadteLectureNo = `UPDATE lecture SET bookable = 0 WHERE id = ${lectureId}`
        let numOfBookings = `SELECT    B.id,
                                    L.id
                          FROM      booking B,
                                    lecture L
                          WHERE     L.id = ${lectureId} AND
                                    L.id = B.ref_lecture AND
                                    B.active = 1`
        let seats = `SELECT C.seats FROM class C, lecture L WHERE L.ref_class = C.id AND L.id = ${lectureId}`
        db.all(numOfBookings, [], (err, rows) => {
            if (err){
                console.log('------------------' + err)
                    reject(0) 
            } else{
                db.get(seats, [], (err, row) =>{
                    if (row.seats > rows.length){
                        // console.log("You can book the lecture, already booking numbers:  " + rows.length + " Total numbers of seat are: " + row.seats + " lecture id is " + lectureId)
                        db.run(upadteLecture,[], (err) =>{
                            if(err) {
                                // console.log("-------------------"+err)
                            }
                        })
                        resolve(1)
                    }else {
                        // console.log("There is no free seats for student. err massage is:" + err)
                        db.run(upadteLectureNo)
                        resolve(0)
                    }
                })
            }
        })
    }))
}



/**
 * @Feihong 
 * @param {*} studentId 
 * get the waiting list of a student 
 */
// TODO:
exports.getWaitingList = ( studentId) => {
    return new Promise ((resolve, reject) =>{
        let query = `SELECT W.id, 
                            W.ref_student, 
                            W.ref_lecture, 
                            W.date, 
                            W.active, 
                            CO.desc, 
                            CL.desc AS cldesc,
                            L.presence,
                            L.date AS lecdate
                        FROM waiting W, 
                            lecture L, 
                            course CO,
                            class  CL 
                        WHERE W.ref_student = ${studentId} AND
                            W.ref_lecture = L.id AND
                            L.ref_course = CO.id AND
                            L.ref_class  = CL.id`
        db.all(query, [], ( err, rows ) => {
            if (err) reject('can not get waiting list')
            if (rows) resolve(rows)
            else reject(0)
        })
    })
}

/**
 * @Feihong
 * @param {*} lectureId 
 * Functions:
 * 1. delete a waiting item
 * 2. add the lecture and student of the waiting item to booking table
 * 3. get the informations of the stuedent who picked from waiting table and was added into booking table with a lecture
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
 */
exports.deleteWaitingAddBooking = (lectureId) =>{
    return new Promise ((resolve, reject) => {
        let getQuery = `SELECT ref_student, ref_lecture FROM waiting WHERE ref_lecture = ${lectureId}`
        let delQuery = `DELETE FROM waiting WHERE ref_student = ? AND ref_lecture = ?`
        
        db.get(getQuery, [], (err, row) => {
            if(err){
                console.log("----delete waiting err, getQuery wrong "+ err)
                reject (0)
            } else {
                if (row){
                    var sId = row.ref_student
                    console.log("++++sid: " + sId);
                    db.run(delQuery, [sId, lectureId], (err) => {
                        if (err) {
                            console.log("----delete waiting err : "+ err)
                            reject(-2)
                        } else {
                            let bookQuery = `INSERT INTO booking (ref_student,ref_lecture,date) VALUES ( ${ sId },${ lectureId },${ moment().valueOf() })`
                            db.run(bookQuery, [], (err) => {
                                if (err){
                                    console.log("----sid: " + sId + "  lectureid:  "+ lectureId);
                                    console.log("----delete waiting err, can not add a new booking : "+ err)
                                    reject(-3)
                                }else {
                                    console.log("++++ delete waiting sucessful, add a new booking successfully. studentid: "+ sId + "  lectureid: " + lectureId);
                                    // TODO: resolve the row, that include the student informations
                                    let infosQuery = `  SELECT  LE.date AS lectureDate,
                                                                CO.desc AS courseDescription,
                                                                CL.desc  AS lectureClass,
                                                                ST.name As studentName,
                                                                ST.surname AS studentSurname,
                                                                ST.email   AS studentEmail,
                                                                ST.id AS studentId
                                                        FROM    student ST,
                                                                lecture LE,
                                                                class   CL,
                                                                course  CO,
                                                                booking B
                                                        WHERE   B.ref_lecture = ${lectureId} AND
                                                                B.ref_student = ${sId} AND
                                                                ST.id = ${sId} AND
                                                                LE.id = ${lectureId} AND
                                                                LE.ref_class = CL.id AND
                                                                LE.ref_course = CO.id AND
                                                                B.active = 1`
                                    db.get(infosQuery, [], (err, row) => {
                                        if(err){
                                            console.log("----delete waiting err, Student information query is wrong : "+ err)
                                            reject (-4)
                                        } else {
                                            if(row){
                                                console.log("++++ delete waiting sucessful, successfully get the student informations: "+ row);
                                                resolve(row)
                                            } else{
                                                console.log("----delete waiting err, can not get student information: "+ row)
                                                reject(-5)
                                            }
                                        }
                                    })

                                }
                            })
                        }
                    })
                } else {
                    console.log("----delete waiting err, no such a lecture in waiting list : "+ err)
                    reject(-1)
                }
            }
        })
        
    })
}


/*
* Get lecture statistics
* */

exports.getLectureStats = (lectureId) => {
    return new Promise(((resolve, reject) => {
        let query = `SELECT date,
                            CO.desc AS course,
                            CL.desc AS classroom
                       FROM lecture L,
                            class CL,
                            course CO
                       WHERE L.ref_class = CL.id AND
                             L.ref_course = CO.id AND
                             L.id = ${lectureId};`
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows[0]);
            else resolve(0);
        });
    }));
}


/*
* Get list of student's lectures
* */

exports.getStudentLectures = (studentId) => {
    return new Promise(((resolve, reject) => {
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
                                                S.ref_student = ${studentId}
                            );`
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
            else resolve(0);
        });
    }));
}

/*
* Get list of teacher's lectures
* */

exports.getTeacherLectures = (teacherId) => {
    return new Promise(((resolve, reject) => {
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
                                C.ref_teacher = ${teacherId};`
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
            else resolve(0);
        });
    }));
}

/*
* Get a list of students who will attend a lecture
* */
exports.getStudentsForLecture = (lectureId) => {
    return new Promise(((resolve, reject) => {
        let query = `SELECT S.id,S.email,S.name,S.surname FROM booking B, student S WHERE B.ref_student=S.id AND B.active=1 AND B.ref_lecture = ${lectureId};`
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

exports.getStudentsForLecturev2 = (teacherId) => {
    return new Promise(((resolve, reject) => {
        let query = `SELECT DISTINCT B.ref_student as studentId,B.ref_lecture as lId
                     FROM booking B,course CO, lecture L
                     WHERE B.ref_lecture=L.id AND L.ref_course=CO.id AND B.active=1 AND CO.ref_teacher=${teacherId};`
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
            else resolve(0);
        });
    }));
}


/*
* Delete a booking
* */

exports.cancelBookings = (bookingId) => {
    return new Promise(((resolve, reject) => {
        let query = `UPDATE booking SET active = 0 WHERE id = ${bookingId};`
        db.run(query, [], function (err) {
            if (err) reject(err);
            if (this.changes) resolve(1);
            else resolve(0);
        });
    }));
}

/*
* Delete a booking  -v2


/*exports.cancelBooking = (bookingId) => {
    return new Promise(((resolve, reject) => {
        let query = `DELETE FROM booking WHERE id = ${bookingId};`
        db.run(query, [], function (err) {
            if (err) reject(err);
            if (this.changes) resolve(1);
            else resolve(0);
        });
    }));
}
* */

/*
* Get a list of student's booking
* */

exports.getStudentBookings = (studentId) => {
    return new Promise(((resolve, reject) => {
        let query = `   SELECT  B.id,
                                B.date,
                                B.active as activeB,
                                B.presence,
                                B.ref_lecture,
                                L.date,
                                L.presence,
                                L.active as activeL,
                                C.desc as course,
                                Cl.desc as class,
                                seats,
                                name,
                                surname,
                                B.ref_student
                        FROM    booking B,
                                lecture L,
                                course C,
                                class CL,
                                teacher T
                        WHERE   B.ref_lecture = L.id AND
                                L.ref_class = CL.id AND
                                L.ref_course = C.id AND
                                C.ref_teacher = T.id AND
                                B.ref_student = ${ studentId } AND
                                B.active = 1;`
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

exports.cancelLecture = (lectureId) => {
    return new Promise(((resolve, reject) => {
        let query = `UPDATE lecture SET active = 0, bookable = 0 WHERE id = ${lectureId};`
        db.run(query, [], function (err) {
            if (err) reject(err);
            if (this.changes) resolve(1);
            else resolve(0);
        });
    }));
}

/*
* Get tomorrow's lessons stats
* */

exports.getTomorrowLessonsStats = (test = false) => {
    return new Promise(((resolve, reject) => {
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
                                L.date > ${test ? 1605398400000 : moment().milliseconds(0)
                .seconds(0)
                .minute(0)
                .hour(0)
                .add(1, "day")
                .valueOf()} AND
                                L.date < ${test ? 1605571199000 : moment().milliseconds(0)
                .seconds(0)
                .minute(0)
                .hour(0)
                .add(2, "days")
                .valueOf()} AND
                                CL.id = L.ref_class
                        GROUP BY B.ref_lecture;`
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            else if (rows) resolve(rows);
            else resolve(0);
        });
    }));
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
exports.turnLectureIntoOnline = (lectureId,teacherId = 0) => {
    return new Promise((resolve, reject) => {
        let query1 = `  SELECT  L.active as active, L.date as date
                        FROM lecture L, course C
                        WHERE L.ref_course = C.id AND L.id = ${lectureId} AND C.ref_teacher = ${teacherId}`;
        let query2 = `UPDATE lecture SET presence = 0, ref_class = 0 WHERE id = ${lectureId} AND active = 1;`
        let now = moment().valueOf(); // in milliseconds

        db.get(query1, [], function (error1, couple) {
            if (couple === undefined) {
                reject(-1);
            } else if (couple.active === 0) {
                reject(-2);
            } else if (now > couple.date - 1800000 && now < couple.date) {
                reject(-3);
            } else if (error1) {
                reject(-4);
            } else {
                db.run(query2, [], function (error2) {
                    if (error2) {
                        reject(-4);
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
                        db.all(getInformationToSendEmailsQuery, [], function (error3, rows) {
                            if (error3) reject(-4);
                            else resolve(rows);
                        });
                    }
                });
            }
        });

    });
}


/*
* Get all bookings to be grouped by week, month or single lecture
* */

exports.getTeacherBookingStatistics = (teacherId, courseId, groupBy) => {
    return new Promise(((resolve, reject) => {
        let now = moment();
        if (groupBy === 'lecture') {
            // the row C.ref_teacher = ${teacherId} is useful if one course can be held by more than one teacher
            // no rows are returned if a the course is not assigned to the teacher
            // L.id is needed for sqlite (group by requires it in the select), but it is useless for showing statistics
            // the course description is not needed, it is already present in the front end
            let perLectureQuery = `SELECT COUNT(*) as bookingNumber,
                            L.id as lectureId,
                            L.date as lectureDate
                    FROM    booking B,
                            lecture L,
                            course C
                    WHERE   B.ref_lecture = L.id AND
                            L.ref_course = C.id AND
                            C.ref_teacher = ? AND
                            C.id = ? AND
                            L.presence = 1
                    GROUP BY lectureId
                    ORDER BY lectureDate
                    ;`
            db.all(perLectureQuery, [teacherId, courseId], (error, rows) => {
                if (error) reject(error);
                else resolve(rows);
            });
        } else if (groupBy === 'week') {
            let earliestDateQuery = `
                SELECT  MIN(L.date) as earliestDate
                FROM lecture L
            ;`
            db.get(earliestDateQuery, [], function (error1, row1) {
                if (error1) reject(error1);
                else {
                    // set the locale so as to start the week from Monday
                    let earliestWeek = moment(row1.earliestDate)
                        .startOf('week')
                    let successiveWeek = earliestWeek.clone().add(1, 'week');
                    // the sampleDate field is not meaningful because there may be bookings in
                    // different lectures but in the same week; it is just an expedient to keep
                    // trace of which week the bookingNumber belongs to
                    let getStatisticsInWeekQuery = `
                        SELECT  COUNT(*)/COUNT(DISTINCT L.id) as avgNumbers, MAX(L.date) as sampleDate, COUNT(*) as bookingNumber, COUNT(DISTINCT L.id) as totLectures
                        FROM    lecture L,
                                booking B,
                                course C
                        WHERE   B.ref_lecture = L.id AND
                                L.ref_course = C.id AND
                                C.ref_teacher = ? AND
                                C.id = ? AND
                                L.date >= ? AND
                                L.date < ? AND
                                L.presence = 1
                        ORDER BY sampleDate
                    ;`
                    let statistics = [];
                    // the number of callbacks equals the number of loops in the while cycle; this property
                    // enables to infer which query (and therefore callback) is executed last
                    // notice that first the whole cycle is processed, and then the callbacks are called in
                    // order, starting from the oldest one
                    let numberOfLoops = 0, numberOfCallbacks = 0;
                    while (now.isAfter(earliestWeek)) {
                        db.get(getStatisticsInWeekQuery, [teacherId, courseId, earliestWeek.valueOf(), successiveWeek.valueOf()], function (error, row) {
                            if (error) reject(error);
                            else {
                                // if in the considered week there was at least one lecture
                                if (row.sampleDate !== null && row.bookingNumber !== 0) {
                                    statistics.push({ bookingNumber: parseFloat(row.bookingNumber) / parseFloat(row.totLectures), week: moment(row.sampleDate).startOf('week').valueOf() });
                                }
                                // infer if it this is the last executed query
                                numberOfCallbacks++;
                                if (numberOfCallbacks === numberOfLoops) {
                                    resolve(statistics);
                                }
                            }
                        });
                        earliestWeek.add(1, 'week');
                        successiveWeek.add(1, 'week');
                        numberOfLoops++;
                    }
                }
            });
        } else {
            let earliestDateQuery = `
                SELECT  MIN(L.date) as earliestDate
                FROM lecture L
            ;`
            db.get(earliestDateQuery, [], function (error1, row1) {
                if (error1) reject(error1);
                else {
                    // set the locale so as to start the week from Monday
                    moment.locale('it');
                    let earliestMonth = moment(row1.earliestDate)
                        .startOf('month')
                    let successiveMonth = earliestMonth.clone().add(1, 'month');
                    // the sampleDate field is not meaningful because there may be bookings in
                    // different lectures but in the same week; it is just an expedient to keep
                    // trace of which week the bookingNumber belongs to; the other possibility
                    // seems to directly use the earliestMonth variable, but the callback should
                    // not rely upon changing variables
                    let getStatisticsInMonthQuery = `
                        SELECT  COUNT(*)/COUNT(DISTINCT L.id) as avgNumbers, MAX(L.date) as sampleDate, COUNT(*) as bookingNumber, COUNT(DISTINCT L.id) as totLectures
                        FROM    lecture L,
                                booking B,
                                course C
                        WHERE   B.ref_lecture = L.id AND
                                L.ref_course = C.id AND
                                C.ref_teacher = ? AND
                                C.id = ? AND
                                L.date >= ? AND
                                L.date < ? AND
                                L.presence = 1
                        ORDER BY sampleDate
                    ;`
                    let statistics = [];
                    // the number of callbacks equals the number of loops in the while cycle; this property
                    // enables to infer which query (and therefore callback) is executed last
                    // notice that first the whole cycle is processed, and then the callbacks are called in
                    // order, starting from the oldest one
                    let numberOfLoops = 0, numberOfCallbacks = 0;
                    while (now.isAfter(earliestMonth)) {
                        db.get(getStatisticsInMonthQuery, [teacherId, courseId, earliestMonth.valueOf(), successiveMonth.valueOf()], function (error, row) {
                            if (error) reject(error);
                            else {
                                // if in the considered month there was at least one lecture
                                if (row.sampleDate !== null && row.bookingNumber !== 0) {
                                    statistics.push({ bookingNumber: parseFloat(row.bookingNumber) / parseFloat(row.totLectures), month: moment(row.sampleDate).startOf('month').valueOf() });
                                }
                                // infer if it this is the last executed query
                                numberOfCallbacks++;
                                if (numberOfCallbacks === numberOfLoops) {
                                    resolve(statistics);
                                }
                            }
                        });
                        earliestMonth.add(1, 'month');
                        successiveMonth.add(1, 'month');
                        numberOfLoops++;
                    }
                }
            });
        }

    }));
}

/*
* Get all presence grouped by week,month or single lecture
* Time handling should be done on frontend due to a too simple handling of date format in sqlite
* */

exports.getTeacherPresenceStats = (teacherId) => {
    return new Promise(((resolve, reject) => {
        let query = `    SELECT *
                         FROM   booking B,
                                lecture L,
                                course C
                         WHERE  B.ref_lecture = L.id AND
                                L.ref_course = C.id AND
                                C.ref_teacher = ${teacherId} AND
                                active = 1 AND
                                presence = 1 AND
                                L.date < ${moment().valueOf()};`
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
            else resolve(0);
        });
    }));
}

/*
* Get the total of bookings, cancellations and attendances of the system
* */

/*exports.getManagerStats = () => {
    return new Promise(((resolve, reject) => {
        //Result => [ BOOKING COUNT, CANCELLATION COUNT, PRESENCE COUNT ]
        let query = `SELECT COUNT(*) FROM booking WHERE active = 1 UNION ALL
                     SELECT COUNT(*) FROM booking WHERE active = 0 UNION ALL
                     SELECT COUNT(*) FROM booking WHERE presence = 1;`
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
            else resolve(0);
        });
    }));
}*/

/*
GET total info about bookings
*/

exports.getAllBookings=(course,lecture)=>{
    return new Promise((resolve,reject)=>{
        let query=`SELECT B.ref_student as userId, S.name as userName, S.surname as userSurname, C.desc as course,L.id as lecId,L.date as dataStart, L.endTime as dataFinish, CL.desc as classC,B.presence as presence
                    FROM booking B, lecture L, course C, class CL,student S
                    WHERE B.ref_student=S.id AND B.ref_lecture=L.id AND CL.id=L.ref_class AND L.ref_course=C.id AND B.active=1;`; //remember if delete last condition in WHERE statement
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows){
                lecture=parseInt(lecture);
                if(course && course!=="All")
                    rows=rows.filter(c=>c.course===course);
                if(lecture && lecture!==-1)
                    rows=rows.filter(l=>l.lecId===lecture);

                resolve(rows);
            }
            else resolve(0);
        });

    });
}

exports.getAllAttendances = (course, lecture) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT B.ref_student as userId, S.name as userName, S.surname as userSurname, C.desc as course,L.id as lecId,L.date as dataStart, L.endTime as dataFinish, CL.desc as classC,B.presence as presence
                    FROM booking B, lecture L, course C, class CL,student S
                    WHERE B.ref_student=S.id AND B.ref_lecture=L.id AND CL.id=L.ref_class AND L.ref_course=C.id AND B.active=1 AND B.presence=1;`; //remember if delete last condition in WHERE statement
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows) {
                lecture = parseInt(lecture);
                if (course && course !== "All")
                    rows = rows.filter(c => c.course === course);
                if (lecture && lecture !== -1)
                    rows = rows.filter(l => l.lecId === lecture);

                resolve(rows);
            }
            else resolve(0);
        });

    });
}

/**
 * Get info about all cancelled lectures
 */

 exports.getAllCancellationsLectures=(course,lecture)=>{
     return new Promise((resolve,reject)=>{
        let query=`SELECT T.id as userId,T.name as userName,T.surname as userSurname,C.desc as course,CL.desc as classC,L.id as lecId,L.date as dataStart,L.endTime as dataFinish
                    FROM lecture L, course C, class CL,teacher T
                    WHERE L.ref_course=C.id AND L.ref_class=CL.id AND C.ref_teacher=T.id AND L.active=0;`;
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows){
                lecture=parseInt(lecture);
                if(course && course!=="All")
                    rows=rows.filter(c=>c.course===course);
                if(lecture && lecture!==-1)
                    rows=rows.filter(l=>l.lecId===lecture);
                resolve(rows);
            }
            else resolve(0);
        });;

     });
 }

  exports.getAllCancellationsBookings=(course,lecture)=>{
     return new Promise((resolve,reject)=>{
        let query=`SELECT B.ref_student as userId, S.name as userName, S.surname as userSurname, C.desc as course,L.id as lecId,L.date as dataStart, L.endTime as dataFinish, CL.desc as classC,B.presence as presence
                    FROM booking B, lecture L, course C, class CL,student S
                    WHERE B.ref_student=S.id AND B.ref_lecture=L.id AND CL.id=L.ref_class AND L.ref_course=C.id AND B.active=0;`;
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows){
                lecture=parseInt(lecture);
                if(course && course!=="All")
                    rows=rows.filter(c=>c.course===course);
                if(lecture && lecture!==-1)
                    rows=rows.filter(l=>l.lecId===lecture);
                resolve(rows);
            }
            else resolve(0);
        });;

     });
 }

 exports.getAllCourses=()=>{
     return new Promise((resolve,reject)=>{
        let query=`SELECT C.desc as course,C.id as id
                    FROM course C;`;
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
            else resolve(0);
        });

     });
 }

 exports.getAllLectures=()=>{
     return new Promise((resolve,reject)=>{
        let query=`SELECT L.id as lecId
                    FROM lecture L;`;
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
            else resolve(0);
        });

     });
 }

/*
* Get all attendance of a positive student and the relative people involved in
* */

// This function get the lecture and teacher that were in contact with the positive student

function getInvolvedLecturesAndTeacher(studentId, test) {
    return new Promise(((resolve, reject) => {
        let now = moment().valueOf();
        let twoWeeksAgo = moment().subtract(14, 'days').valueOf();

        let query = `SELECT L.id as lecID,
                            T.id as tID
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
                                        WHERE   B.ref_lecture = L.id AND
                                                B.ref_student = ${studentId} AND
                                                B.presence = 1 AND
                                                L.date < ${test ? 1607960293000 : now} AND
                                                L.date > ${test ? 1606837080000 : twoWeeksAgo} );`
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows) {
                if(rows.length === 0) {
                    resolve (null);
                }
                resolve(rows);
            }
            else resolve(0);
        });
    }));
}

function getInvolvedStudents(involvedLectures, studentId) {
    return new Promise(((resolve, reject) => {

        let query = `SELECT DISTINCT(B.ref_student) as sID
                    FROM booking B,
                        lecture L
                    WHERE B.ref_lecture = L.id AND
                        B.presence = 1 AND
                        B.active = 1 AND
                        B.ref_student != ? AND `

        // add the lectures, such as:  (B.ref_lecture = 7 OR B.ref_lecture = 9) ..

        //let queryToAdd = `(B.ref_lecture = `

        let involvedLec = involvedLectures.map((lectureId, i) => {
            if(i === 0)
                return '(B.ref_lecture = ' + lectureId;
            else
                return ' OR B.ref_lecture = ' + lectureId;
        })
            .reduce((previousValue, currentValue, currentIndex) => {
                if (currentIndex === 0)
                    return currentValue;
                else return previousValue.concat(currentValue);
            });
        query = query.concat(involvedLec).concat(');');
        //console.log(query);

        db.all(query, [studentId], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
            else resolve(0);
        });
    }));
}

exports.getContactsWithPositiveStudent = function (studentId, test = false) {
    return new Promise(async (resolve, reject) => {
        let involved = await getInvolvedLecturesAndTeacher(studentId, test);
        //  console.log("involved:");
        //  console.log(involved);

        if(involved != null) {
            let involvedTeachers = involved.map(r => r.tID);
            let uniqTeachers = [...new Set(involvedTeachers)];
            let involvedLectures = involved.map(r => r.lecID);
            // console.log("involved teachers:");
            // console.log(uniqTeachers);
            // console.log("involved lectures:");
            // console.log(involvedLectures);

            let involvedStudents = await getInvolvedStudents(involvedLectures, studentId);
            involvedStudents = involvedStudents.map(s => s.sID);
            //console.log(involvedStudents);
            //let involvedStudents;

            // involvedLectures.forEach(lecID => {
            //     involvedStudents = await getInvolvedStudents(lecID, studentId);
            //     console.log("involved students:");
            //     console.log(involvedStudents);
            // });

            // const involvedStudents = await involvedLectures
            //     .map(async lecID => {
            //         const invStudents = await getInvolvedStudents(lecID, studentId)
            //         console.log(invStudents);
            //         involvedStudents = involvedStudents.concat(invStudents);
            //         return invStudents
            //     })

            // let involvedTot = involvedTeachers.concat(involvedStudents);
            // console.log("involved tot:")
            // console.log(involvedTot);
            // resolve(involvedTot);
            resolve({uniqTeachers, involvedStudents});
        }
        else {
            let uniqTeachers = null;
            let involvedStudents = null;
            resolve({uniqTeachers, involvedStudents});
        }
    });
}

/*
* Get all lectures of a positive teacher and the relative people involved in
* */

exports.teacherContactTracing = (teacherId) => {
    return new Promise(((resolve, reject) => {
        let now = moment();
        let twoWeeksAgo = now.subtract(14, 'days');

        let query = `SELECT S.name as sname,
                            S.surname as ssurname
                     FROM   booking B,
                            lecture L,
                            student S,
                            course C
                     WHERE  B.ref_student = S.id AND
                            B.ref_lecture = L.id AND
                            L.ref_course = C.id AND
                            C.ref_teacher = ${teacherId} AND
                            B.presence = 1 AND
                            L.date < ${now.valueOf()} AND
                            L.date > ${twoWeeksAgo.valueOf()};`
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
            else resolve(0);
        });
    }));
}

/*
* Make bookable/no bookable a lecture
* */

exports.editBookableLecture = (lectureId, bookable) => {
    return new Promise(((resolve, reject) => {
        let query = `UPDATE lecture SET bookable = ${bookable} WHERE id = ${lectureId};`
        db.run(query, [], function (err) {
            if (err) reject(err);
            if (this.changes) resolve(1);
            else resolve(0);
        });
    }));
}

/*
* Get all courses, with relative lectures anda dates
* */

exports.getOfficerCoursesLectures = () => {
    return new Promise(((resolve, reject) => {
        let query = `SELECT * FROM lecture L, course C WHERE L.ref_course = C.id;`
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
            else resolve(0);
        });
    }));
}

/*
* Edit a lecture date
* */

exports.editLectureDate = (lectureId, newDate) => {
    return new Promise(((resolve, reject) => {
        let query = `UPDATE lecture SET date = ${newDate} WHERE id = ${lectureId};`
        db.run(query, [], function (err) {
            if (err) reject(err);
            if (this.changes) resolve(1);
            else resolve(0);
        });
    }));
}

exports.setPresenceLecture = (lectureId, className) => {
    return new Promise(((resolve, reject) => {
        let queryClass = `SELECT id FROM class WHERE desc = ${className}`;
        let queryLecture = `UPDATE lecture SET presence = 1, ref_class = ? WHERE id = ${lectureId}`;
        db.get(queryClass, [], (err, row) => {
            if (err) reject(err);
            if (row) {
                db.run(queryLecture, [row.id], (err1) => {
                    if (err1) reject(err1);
                    else resolve(1);
                })
            }
        })
    }));
}

exports.loadCsvData = (data) => {
    return new Promise( ( resolve, reject ) => {
        let query = '';
        //Classes inserting
        data.classes.forEach( ( class_ ) => {
            query += `INSERT INTO class (id,desc,seats) values  (${ class_.id },'${ class_.desc }',${ class_.seats }); `
        } );
        //Teachers inserting
        data.teachers.forEach( ( teacher ) => {
            query += `insert into teacher (id, email, password, name, surname) VALUES (${ teacher.id },'${ teacher.email }','${ teacher.password }','${ teacher.name }','${ teacher.surname }'); `
        } );
        //Students inserting
        data.students.forEach( ( student ) => {
            query += `insert into student (id, email, password, name, surname) VALUES (${ student.id },'${ student.email }','${ student.password }','${ student.name }','${ student.surname }'); `
        } );
        //Courses inserting
        data.courses.forEach( ( course ) => {
            query += `insert into course (id, desc, ref_teacher) VALUES (${ course.id },'${ course.desc }',${ course.ref_teacher }); `
        } );
        //Subscriptions inserting
        data.subscriptions.forEach( ( subscription ) => {
            query += `insert into subscription (ref_student, ref_course) VALUES (${subscription.ref_student},${subscription.ref_course}); `
        } );
        //Students inserting
        data.lectures.forEach( ( lecture ) => {
            query += `insert into lecture (ref_course, ref_class, date, endTime, presence, bookable, active) VALUES (${ lecture.ref_course },${ lecture.ref_class },${ lecture.date },${ lecture.endTime },${ lecture.presence },${ lecture.bookable },${ lecture.active }); `
        } );
        console.log(query);
        db.exec( "BEGIN TRANSACTION; " + query + " COMMIT;", ( err ) => {
            err ? reject( 0 ) : resolve( 0 );
        } );
    });
}
