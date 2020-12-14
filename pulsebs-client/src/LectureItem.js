import React       from 'react';
import moment      from 'moment';
import Image       from 'react-bootstrap/Image';
import { BiCalendarX } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import {AuthContext} from './auth/AuthContext';

const LectureItem = ( props ) => {

    let {lecture, bookings, bookSeat, alreadyBooked,cancelBooking, getBookingFromLecture} = props;

    alreadyBooked = (lectureId,studentId) => {
        const booking = getBookingFromLecture(lectureId, studentId);
        if(booking === 0) return true;
        if(booking.active === 1) return false;
        else return true;
    }

    getBookingFromLecture = (lectureId,studentId) => {
        console.log(bookings)
        console.log(lectureId + " " + studentId);
        let booking = bookings.find( (booking) => {
            return booking.ref_lecture === lectureId && booking.ref_student === studentId
        })
        console.log(booking)
        if(!booking) return 0;
        else return booking;
    }


    return (
        <AuthContext.Consumer>
            {(context)=>(
            <>
                <tr key={lecture.id}>
                    <td>{ moment( new Date( lecture.date ) ).format( "YYYY-MM-DD" ) }</td>
                    <td>{ moment( new Date( lecture.date ) ).format( "HH:mm" ) }</td>
                    { lecture.presence === 1 && <td>yes</td> }
                    { lecture.presence === 0 && <td>no</td> }
                    <td>{ lecture.courseDesc }</td>
                    <td>{ lecture.classDesc }</td>
                    <td>{ lecture.teacherName + " " + lecture.teacherSurname }</td>
                    { lecture.date < moment().valueOf() || lecture.bookable === 0 ? <ImCross /> :
                        lecture.bookable === 1 && alreadyBooked(lecture.id,context.authUser.id) ?
                    <td><Image width="30" height="30" className="img-button" type="button" src="/svg/calendar.svg" alt=""
                            onClick={ () => bookSeat(context.authUser.id, lecture.id ) }/></td> :
                        <td><BiCalendarX size={25} className={"img-button"} type={"button"} onClick={ () => {
                            console.log("cancelled");
                            let booking = getBookingFromLecture(lecture.id,context.authUser.id);
                            cancelBooking( context.authUser.id, booking.id )
                        }}/></td>
                        /*do something if it fails*/
                    }
                </tr>
            </>
             )}
        </AuthContext.Consumer>
    );
}

export default LectureItem;
