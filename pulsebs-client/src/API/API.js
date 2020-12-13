import Lecture from './Lecture.js'
import Booking from './Booking.js'
import Waiting from './Waiting'
import LectureTeacher from './LectureTeacher.js'
import { Ellipsis } from 'react-bootstrap/esm/PageItem';
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
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
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
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
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
        //console.log(lecturesJson);
        return lecturesJson.map((l) => new Lecture(l.id, l.date, l.presence, l.bookable, l.active, l.course, l.name, l.surname, l.class));
    } else {
        let err = { status: response.status, errObj: lecturesJson };
        throw err;  // An object with the error coming from the server
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
            .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
        }
    }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
 });
}

async function getStudentBookings() {
    let url = "/student/bookings";
    const response = await fetch(baseURL + url);
    const bookingsJson = await response.json();
    if(response.ok){
        //console.log(bookingsJson);
        return bookingsJson.map((b) => new Booking(b.id,b.ref_student, b.ref_lecture, b.date, b.course, b.class, b.presence, b.active));
    } else {
        let err = { status: response.status, errObj: bookingsJson };
        throw err;  // An object with the error coming from the server
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
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); //something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
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
        let err = {status: response.status, errObj:lecturesJson};
        throw err;
    }
}

async function getStudents(filter) {
    let url = "/teacher/getStudentsForLecture";
    const response = await fetch(baseURL + url);
    const idJson = await response.json();
    if (response.ok) {
        return idJson;
    } else {
        let err = { status: response.status, errObj: idJson };
        throw err;  // An object with the error coming from the server
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
                .catch( (err) => { reject({errors: [{ param: "Application", msg: "Cannot parse server response" }]})}); //something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    })
}


async function isAuthenticated(){
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if(response.ok){
        return userJson;
    } else {
        let err = {status: response.status, errObj:userJson};
        throw err;  // An object with the error coming from the server
    }
}




const API = { login, logout, getStudentLectures, bookSeat, getWaitingList, getStudentBookings, cancelBooking, addStudentToWaitingList, checkSeatsOfLecture, deleteWaitingAddBooking, getTeacherLectures, getStudents,isAuthenticated, turnLectureIntoOnline, cancelLecture };
export default API;
