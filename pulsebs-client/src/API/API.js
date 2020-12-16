import Lecture from './Lecture.js'
import Booking from './Booking.js'
import Student from './Student'
import Teacher from './Teacher'
import Course from './Course'
import Waiting from './Waiting'
import Enrollment from './Enrollment'
import Class from './Class'
import scheduledLecture from './scheduledLecture'
import LectureTeacher from './LectureTeacher.js'

const baseURL = "/api";


async function login(email, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch(() => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch(() => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function logout() {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch(() => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}

/****** STUDENT *******/

async function getStudentLectures() {
    let url = "/student/lectures";
    const response = await fetch(baseURL + url);
    const lecturesJson = await response.json();
    if(response.ok){
        return lecturesJson.map((l) => new Lecture(l.id, l.date, l.presence, l.bookable, l.active, l.course, l.name, l.surname, l.class));
    } else {
        throw {status: response.status, errObj: lecturesJson};  // An object with the error coming from the server
    }
}

// FIXME:
async function bookSeat(studentId, lectureId) {
    return new Promise((resolve, reject) => {
    fetch(baseURL + "/students/" + studentId + "/booking", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({lectureId : lectureId}),
    }).then((response) => {
        if(response.ok) {
            resolve(response);
        } else {
            // analyze the cause of error
            console.log("errore msg");
            response.json()
            .then( (obj) => {reject(obj);} ) // error msg in the response body
            .catch( () => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
        }
    }).catch( () => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
 });
}

async function getStudentBookings() {
    let url = "/student/bookings";
    const response = await fetch(baseURL + url);
    const bookingsJson = await response.json();
    if(response.ok){
        //console.log(bookingsJson);
        return bookingsJson.map((b) => new Booking(b.id,b.ref_student, b.ref_lecture, b.date, b.course, b.class, b.presence, b.activeB));
    } else {
        throw {status: response.status, errObj: bookingsJson};  // An object with the error coming from the server
    }

}


/**
 * @Feihong
 * GET /student/waitings
 */
// TODO: get waiting list of lecures of a student 
async function getWaitingList(){
    let url = "/student/waitings";
    const response = await fetch(baseURL + url);
    const waitingsJson = await response.json()
    if (response.ok){
        return waitingsJson.map( (w) => new Waiting(w.id, w.ref_student, w.ref_lecture, w.date, w.active, w.desc, w.cldesc, w.presence, w.lecdate))
    } else{
        let err  ={ status: response.status, errObj: waitingsJson};
        throw err;
    }
}



/**
 * @Feihong
 */
// FIXME: already successfully refactor the URI
async function cancelBooking(studentId, bookingId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/students/' + studentId + '/bookings/' + bookingId, {
            method: 'POST'
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch(() => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); //something else
            }
        }).catch(() => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    })
}

/**
 * @Feihong
 * /api/students/:studentId/lectures/:lectureId
 */
// TODO: Add a student to waiting list, when there is no set 
async function addStudentToWaitingList(studentId, lectureId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/students/' + studentId + '/lectures/' + lectureId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lectureId: lectureId })
        }).then((response) => {
            if (response.ok) {
                resolve(response)
            } else {
                // 
                console.log("error: addStudentToWaitingList()")
                response.json()
                .then( (obj) =>{reject(obj)} )
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "AddWaiting Cannot parse server response" }] }) });
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    })
}

/**
 * @Feihong 
 * api/students/:studentId/lectures/checkSeats/:lectureId
 */
// TODO: According the free seats of a lecture, to Update the bookable attribute of table lecture 
async function checkSeatsOfLecture(studentId, lectureId){
    return new Promise((resolve, reject) =>{
        fetch(baseURL + '/students/' + studentId + '/lectures/checkSeats/' + lectureId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({studentId: studentId, lectureId: lectureId})
        }).then( (response) => {
            if( response.status === 200){
                response.json()
                resolve(1)
            } else{
                response.json()
                reject(0)
            }
        })
    })
}

/**
 * @Feihong
 * /api/students/:studentId/lectures/:lectureId/waiting
 */
// TODO: delete a waiting item from waiting table
async function deleteWaitingAddBooking(studentId, lectureId){
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/students/' + studentId + '/lectures/' + lectureId + '/waiting', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({studentId: studentId, lectureId: lectureId})
        }).then( ( response ) => {
            if (response.ok) {
                response.json()
                resolve(1)
            } else {
                response.json()
                reject(0)
            }
        })
    })
}

/****** TEACHER *******/
async function getTeacherLectures() {
    let url="/teacher/lectures";
    const response=await fetch(baseURL+url);
    const lecturesJson=await response.json();
    if(response.ok){
        return lecturesJson.map((l) => new LectureTeacher(l.course, l.class, l.id,l.lecId, l.date, l.endTime, l.presence, l.bookable, l.active));
    }else{
        throw {status: response.status, errObj: lecturesJson};
    }
}

async function getStudents() {
    let url = "/teacher/getStudentsForLecture";
    const response = await fetch(baseURL + url);
    const idJson = await response.json();
    if (response.ok) {
        return idJson;
    } else {
        throw {status: response.status, errObj: idJson};  // An object with the error coming from the server
    }
}

async function turnLectureIntoOnline(lectureId, teacherId = 0) {
    // teacherId is useless, the lectureId is enough
    let url = '/teachers/' + teacherId + '/lectures/' + lectureId;
    let response;
    try {
        response = await fetch(baseURL + url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ presence: 0 })
        });
    } catch (networkError) {
        throw {message: "Network error occured in " + turnLectureIntoOnline.name + ": " + networkError};
    }
    let message;
    try {
        message = (await response.json()).message;
    } catch (parseError) {
        console.log("Parse error occured in " + turnLectureIntoOnline.name + parseError);
    }
    if (response.status === 200) return message;
    else throw {message: message};
}


async function cancelLecture(teacherId, lectureId) {
    console.log(teacherId);
    console.log(lectureId);
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/teachers/" + teacherId + "/lectures/" + lectureId, {
            method: 'DELETE',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);})
                .catch( () => { reject({errors: [{ param: "Application", msg: "Cannot parse server response" }]})}); //something else
            }
        }).catch( () => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    })
}


/**** SUPPORT OFFICE ****/

async function importCSV(students, teachers, courses, enrollments, classes, lectures) {
    console.log(students);
    return new Promise((resolve, reject) => {
    fetch(baseURL + "/sofficer/", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ students: students.map((s) => new Student(s.id, s.name, s.surname, s.email, s.city, s.bday, s.ssn, s.password)),
                               teachers: teachers.map((t) => new Teacher(t.id, t.name, t.surname, t.email, t.password)),
                               courses: courses.map((c) => new Course(c.id, c.year, c.semester, c.course, c.teacher)), 
                               subscriptions: enrollments.map((e) => new Enrollment(e.cid, e.sid)),
                               classes: classes.map((c) => new Class(c.id, c.desc, c.seats)),
                               lectures: lectures.map((l) => new scheduledLecture(l.course, l.ref_class, l.start_date, l.end_date, l.presence, l.bookable, l.active))
                              // schedule: schedules.map((s) => new Schedule(s.id, s.room, s.date, s.seats, s.time))
        }),
    }).then((response) => {
        if(response.ok) {
            console.log("ok");
            resolve(response);
        } else {
            // analyze the cause of error
            console.log("errore msg");
            response.json()
            .then( (obj) => {reject(obj);} ) // error msg in the response body
            .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
        }
    }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
 });
}



async function isAuthenticated(){
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if(response.ok){
        return userJson;
    } else {
        throw {status: response.status, errObj: userJson};  // An object with the error coming from the server
    }
}


async function getTeacherStatistics(teacherId, courseId, groupBy) {
    let url = `/teachers/${teacherId}/statistics/courses/${courseId}?groupBy=${groupBy.toLowerCase()}`;
    const response = await fetch(baseURL + url);
    if (response.status === 500) {
        console.error('The server received a malformed request (in method ' + getTeacherStatistics.name + ')');
        return {
            x: [],
            y: []
        }
    }
    else if (response.status === 200) {
        const responseJson = await response.json();
        let x = responseJson.map(lectureStatistics => lectureStatistics.bookingNumber);
        if (groupBy === 'Lecture') {
            let y = responseJson.map(lectureStatistics => lectureStatistics.lectureDate);
            let average;
            if (y.length === 0) average = 0;
            else average = x.reduce((partialSum, currentValue) => partialSum + currentValue, 0) / y.length;
            return {x, y, average};
        } else if (groupBy === 'Week') {
            //console.log(responseJson);
            let y = responseJson.map(lectureStatistics => lectureStatistics.week);
            let average;
            if (y.length === 0) average = 0;
            else average = x.reduce((partialSum, currentValue) => partialSum + currentValue, 0) / y.length;
            return {x, y, average};
        } else if (groupBy === 'Month') {
            let y = responseJson.map(lectureStatistics => lectureStatistics.month);
            let average;
            if (y.length === 0) average = 0;
            else average = x.reduce((partialSum, currentValue) => partialSum + currentValue, 0) / y.length;
            return {x, y, average};
        }
    }
}

async function getAllBookings(course,lecture) {
    let url = "/manager/getAllBookings";
    if(course){
        const query = "?course=" + course;
        url+=query;
    }
    if(lecture){
        const query = "&lecture=" + lecture;
        url+=query;
    }
    const response = await fetch(baseURL + url);
    const bookingsJson = await response.json();
    if (response.ok) {
        return bookingsJson;
    } else {
        let err = { status: response.status, errObj: bookingsJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getAllAttendances(course,lecture) {
    let url = "/manager/getAllAttendances";
    if(course){
        const query = "?course=" + course;
        url+=query;
    }
    if(lecture){
        const query = "&lecture=" + lecture;
        url+=query;
    }
    const response = await fetch(baseURL + url);
    const bookingsJson = await response.json();
    if (response.ok) {
        return bookingsJson;
    } else {
        let err = { status: response.status, errObj: bookingsJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getAllCancellationsLectures(course,lecture) {
    let url = "/manager/getAllCancellationsLectures";
    if(course){
        const query = "?course=" + course;
        url+=query;
    }
    if(lecture){
        const query = "&lecture=" + lecture;
        url+=query;
    }
    const response = await fetch(baseURL + url);
    const cancellationsJson = await response.json();
    if (response.ok) {
        return cancellationsJson;
    } else {
        let err = { status: response.status, errObj: cancellationsJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getAllCancellationsBookings(course,lecture) {
    let url = "/manager/getAllCancellationsBookings";
    if(course){
        const query = "?course=" + course;
        url+=query;
    }
    if(lecture){
        const query = "&lecture=" + lecture;
        url+=query;
    }
    const response = await fetch(baseURL + url);
    const cancellationsJson = await response.json();
    if (response.ok) {
        return cancellationsJson;
    } else {
        let err = { status: response.status, errObj: cancellationsJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getAllCourses() {
    let url = "/manager/getAllCourses";
    const response = await fetch(baseURL + url);
    const coursesJson = await response.json();
    if (response.ok) {
        return coursesJson;
    } else {
        let err = { status: response.status, errObj: coursesJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getAllLectures() {
    let url = "/manager/getAllLectures";
    const response = await fetch(baseURL + url);
    const lecturesJson = await response.json();
    if (response.ok) {
        return lecturesJson;
    } else {
        let err = { status: response.status, errObj: lecturesJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getContactsWithPositiveStudent(studentId) {
    let url = `/manager/contactWith/${studentId}`;
    const response = await fetch(baseURL + url);
    const contactsJson = await response.json();
    if (response.ok) {
        return contactsJson;
    } else {
        //console.log("API");
        //console.log(response);
        let err = { status: response.status, errObj: contactsJson };
        throw err;  // An object with the error coming from the server
    }
}

const API = { login, logout, getStudentLectures, bookSeat, getStudentBookings, getWaitingList, getStudentBookings, cancelBooking, addStudentToWaitingList, checkSeatsOfLecture, deleteWaitingAddBooking, getTeacherLectures, getStudents,isAuthenticated, turnLectureIntoOnline, cancelLecture, getTeacherStatistics,getAllBookings,getAllCancellationsLectures,getAllCancellationsBookings, getAllCourses,getAllLectures,getAllAttendances, getContactsWithPositiveStudent, importCSV };
export default API;
