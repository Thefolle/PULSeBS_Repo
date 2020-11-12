const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const moment = require('moment');

const User = require('./User');

/*
* Database Connection
*/
const db = new sqlite3.Database('pulsebs.db', (err) => {
    if (err) return console.error(err.message);
    //console.log( 'Connected to the in-memory SQlite database.' );
});

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
                }
                else if (rows.length === 0) {
                    // if none query succeeds, the email doesn't exist anywhere in the DB
                    nTimesUserNotFound++;
                    if (nTimesUserNotFound == 3) reject(undefined);
                    // email doesn't belong to a type-i user
                }
                else {
                    let row = rows[0];
                    const user = new User(row.id, row.email, row.password, i, row.name, row.surname);
                    resolve(user);
                }
            });
        }

    });
};

exports.checkPassword = function (user, password) {
    /* 
     The salt used to obfuscate passwords is 0
     console.log('hash:' + bcrypt.hashSync('password', 0));
    */
   return bcrypt.compareSync(password, user.hash);
}

/*
* Book a seat for a lecture
* */

exports.bookSeat = (lectureId, studentId) => {
    return new Promise(((resolve, reject) => {
        //1 - Check if student is undersigned to that course
        //2 - Insert a new booking record

        let checkQuery = "SELECT COUNT(*) " +
            "FROM subscription S,course C,lecture L " +
            "WHERE S.ref_course = C.id AND C.id = L.ref_course AND " +
            "L.id = ? AND S.ref_student = ?";
        let bookQuery = "INSERT INTO booking (ref_student,ref_lecture,date) VALUES ( ?,?,?)";

        db.get(checkQuery, [lectureId, studentId], (err, row) => {
            if (err) reject(err);
            if (row) {
                //Student subscription exists
                db.run(bookQuery, [studentId, lectureId, moment().valueOf()], (err) => {
                    err ? reject(err) : resolve(1);
                });
            }
        });
    }));
}

/*
* Get list of student's lectures
* */

exports.getStudentLectures = (studentId) => {
    return new Promise(((resolve, reject) => {
        let query = "SELECT L.id,\n" +
            "       date,\n" +
            "       presence,\n" +
            "       bookable,\n" +
            "       active,\n" +
            "       C.desc,\n" +
            "       name,\n" +
            "       surname,\n" +
            "       CL.desc\n" +
            "FROM lecture L,\n" +
            "     course C,\n" +
            "     teacher T,\n" +
            "     class CL\n" +
            "WHERE L.ref_course = C.id\n" +
            "  AND L.ref_class = CL.id\n" +
            "  AND C.ref_teacher = T.id\n" +
            "  AND C.id IN (\n" +
            "      SELECT C2.id\n" +
            "      FROM subscription S, student ST, course C2\n" +
            "      WHERE S.ref_course = C2.id AND\n" +
            "            S.ref_student = ?\n" +
            "    )"
        db.all(query, [studentId], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
        });
    }));
}

/*
* Get list of teacher's lectures
* */

exports.getTeacherLectures = (teacherId) => {
    return new Promise(((resolve, reject) => {
        let query = "SELECT C.desc as course, CL.desc as class, " +
            "L.date, L.presence, L.bookable " +
            "FROM lecture L,course C,class CL " +
            "WHERE L.ref_course = C.id AND L.ref_class = CL.id AND " +
            "C.ref_teacher = ?"
        db.all(query, [teacherId], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
        });
    }));
}

/*
* Get a list of students who will attend a lecture
* */

exports.getStudentsForLecture = (lectureId) => {
    return new Promise(((resolve, reject) => {
        let query = "SELECT ref_student " +
            "FROM booking B" +
            "WHERE B.ref_lecture = ?"
        db.all(query, [lectureId], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
        });
    }));
}

/*
* Delete a booking
* */

exports.cancelBooking = (bookingId) => {
    return new Promise(((resolve, reject) => {
        let query = "UPDATE booking SET active = 0 WHERE id = ?"
        db.run(query, [bookingId], function (err) {
            if (err) reject(err);
            if (this.changes) resolve(1);
        });
    }));
}

/*
* Get a list of student's booking
* */

exports.getStudentBookings = (studentId) => {
    return new Promise(((resolve, reject) => {
        let query = "SELECT * FROM booking WHERE ref_student = ?"
        db.all(query, [studentId], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
        });
    }));
}

/*
* Delete a lecture
* */

exports.cancelLecture = (lectureId) => {
    return new Promise(((resolve, reject) => {
        let query = "UPDATE lecture SET active = 0 WHERE id = ?"
        db.run(query, [lectureId], function (err) {
            if (err) reject(err);
            if (this.changes) resolve(1);
        });
    }));
}

/*
* Turn a presence lecture into an online one
* */

exports.setPresenceLecture = (lectureId) => {
    return new Promise(((resolve, reject) => {
        let query = "UPDATE lecture SET presence = 0, ref_class = NULL WHERE id = ?"
        db.run(query, [lectureId], function (err) {
            if (err) reject(err);
            if (this.changes) resolve(1);
        });
    }));
}

/*
* Get all bookings to be grouped by week,month or single lecture
* */

exports.getTeacherBookingStats = (teacherId) => {
    return new Promise(((resolve, reject) => {
        let query = "SELECT * " +
            "FROM booking B, lecture L, course C " +
            "WHERE B.ref_lecture = L.id AND L.ref_course = C.id AND" +
            "C.ref_teacher = ? AND active = 1 "

        db.all(query, [teacherId], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
        });
    }));
}

/*
* Get all presence grouped by week,month or single lecture
* */

exports.getTeacherPresenceStats = (teacherId) => {
    return new Promise(((resolve, reject) => {
        let query = "SELECT * " +
            "FROM booking B, lecture L, course C " +
            "WHERE B.ref_lecture = L.id AND L.ref_course = C.id AND" +
            "C.ref_teacher = ? AND active = 1 AND presence = 1 AND L.date < ? "
        db.all(query, [teacherId, moment().valueOf()], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
        });
    }));
}

/*
* Get the total of bookings, cancellations and attendances of the system
* */

exports.getManagerStats = () => {
    return new Promise(((resolve, reject) => {
        //Result => [ BOOKING COUNT, CANCELLATION COUNT, PRESENCE COUNT ]
        let query = "SELECT COUNT(*) FROM booking WHERE active = 1 UNION ALL " +
            "SELECT COUNT(*) FROM booking WHERE active = 0 UNION ALL " +
            "SELECT COUNT(*) FROM booking WHERE presence = 1"
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
        });
    }));
}

/*
* Get all attendance of a positive student and the relative people involved in
* */

exports.studentContactTracing = (studentId) => {
    return new Promise(((resolve, reject) => {
        let now = moment();
        let twoWeeksAgo = now.subtract(14, 'days');

        let query = "SELECT S.name as sname,S.surname as ssurname, " +
            "T.name as tname,T.surname as tsurname " +
            "FROM booking B, lecture L, student S, course C, teacher T " +
            "WHERE B.ref_student = S.id AND B.ref_lecture = L.id AND " +
            "L.ref_course = C.id AND C.ref_teacher = T.id AND " +
            "B.id IN ( " +
            "SELECT B.id " +
            "FROM booking B, lecture L " +
            "WHERE B.ref_lecture = L.lecture AND B.ref_student = ? AND " +
            "B.presence = 1 AND L.date < ? AND L.date > ? )"
        db.all(query, [studentId, now.valueOf(), twoWeeksAgo.valueOf()], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
        });
    }));
}

/*
* Get all lectures of a positive teacher and the relative people involved in
* */

exports.teacherContactTracing = (teacherId) => {
    return new Promise(((resolve, reject) => {
        let now = moment();
        let twoWeeksAgo = now.subtract(14, 'days');

        let query = "SELECT S.name as sname,S.surname as ssurname " +
            "FROM booking B, lecture L, student S, course C" +
            "WHERE B.ref_student = S.id AND B.ref_lecture = L.id AND " +
            "L.ref_course = C.id AND C.ref_teacher = ? AND " +
            "B.presence = 1 AND L.date < ? AND L.date > ? "
        db.all(query, [teacherId, now.valueOf(), twoWeeksAgo.valueOf()], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
        });
    }));
}

/*
* Make bookable/no bookable a lecture
* */

exports.editBookableLecture = (lectureId, bookable) => {
    return new Promise(((resolve, reject) => {
        let query = "UPDATE lecture SET bookable = ? WHERE id = ?"
        db.run(query, [bookable, lectureId], function (err) {
            if (err) reject(err);
            if (this.changes) resolve(1);
        });
    }));
}

/*
* Get all courses, with relative lectures anda dates
* */

exports.getOfficerCoursesLectures = () => {
    return new Promise(((resolve, reject) => {
        let query = "SELECT * " +
            "FROM lecture L, course C" +
            "WHERE L.ref_course = C.id"
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            if (rows) resolve(rows);
        });
    }));
}

/*
* Edit a lecture date
* */

exports.editLectureDate = (lectureId, newDate) => {
    return new Promise(((resolve, reject) => {
        let query = "UPDATE lecture SET date = ? WHERE id = ?"
        db.run(query, [newDate, lectureId], function (err) {
            if (err) reject(err);
            if (this.changes) resolve(1);
        });
    }));
}