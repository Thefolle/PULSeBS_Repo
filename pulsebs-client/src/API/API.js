import Lecture from './Lecture.js'
import Booking from './Booking.js'
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
        console.log(lecturesJson);
        return lecturesJson.map((l) => new Lecture(l.id, l.date, l.presence, l.bookable, l.active, l.course, l.name, l.surname, l.class));
        } else {
        let err = {status: response.status, errObj:lecturesJson};
        throw err;  // An object with the error coming from the server
    }
}


async function bookSeat(lectureId) {
    return new Promise((resolve, reject) => {
    fetch(baseURL + "/student/booking", {
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
        return bookingsJson.map((b) => new Booking(b.id,b.ref_student, b.ref_lecture, b.date, b.course, b.class, b.presence));
    } else {
        let err = {status: response.status, errObj:bookingsJson};
        throw err;  // An object with the error coming from the server
    }

}


/****** TEACHER *******/
async function getTeacherLectures() {
    let url="/teacher/lectures";
    const response=await fetch(baseURL+url);
    const lecturesJson=await response.json();
    if(response.ok){
        return lecturesJson.map((l) => new LectureTeacher(l.course, l.class, l.id,l.lecId, l.date, l.presence, l.bookable));
    }else{
        let err = {status: response.status, errObj:lecturesJson};
        throw err;
    }
}

async function getStudents(filter){
    let url="/getStudentsForLecture";
    if(filter){
        const queryP="?filter="+filter;
        url+=queryP;
    }

    const response=await fetch(baseURL+url);
    const idJson=await response.json();
    if(response.ok){
        return idJson;
    } else {
        let err = {status: response.status, errObj:idJson};
        throw err;  // An object with the error coming from the server
    }
}


const API = { login, logout, getStudentLectures, bookSeat, getStudentBookings, getTeacherLectures, getStudents };
export default API;
