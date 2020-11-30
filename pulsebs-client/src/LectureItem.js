import React       from 'react';
import moment      from 'moment';
import Image       from 'react-bootstrap/Image';
import { BiCalendarX } from "react-icons/bi";

const LectureItem = ( props ) => {

    let {lecture, bookings, bookSeat, alreadyBooked} = props;

    alreadyBooked = (lectureId) => {
            const ids = bookings.map((b) => b.ref_lecture );
            if(ids.includes(lectureId) === true)
              return 1;
            else
              return 0;
    }


    return (
        <tr key={lecture.id}>
            <td>{ moment( new Date( lecture.date ) ).format( "YYYY-MM-DD" ) }</td>
            <td>{ moment( new Date( lecture.date ) ).format( "HH:MM" ) }</td>
            { lecture.presence === 1 && <td>yes</td> }
            { lecture.presence === 0 && <td>no</td> }
            <td>{ lecture.courseDesc }</td>
            <td>{ lecture.classDesc }</td>
            <td>{ lecture.teacherName + " " + lecture.teacherSurname }</td>
            { lecture.bookable === 1 && alreadyBooked(lecture.id) === 0 && lecture.date > moment().valueOf() ?
            <td><Image width="30" height="30" className="img-button" type="button" src="/svg/calendar.svg" alt=""
                       onClick={ () => bookSeat( lecture.id ) }/></td> : <td><BiCalendarX size={25}/></td>
                /*do something if it fails*/
            }
        </tr>
    );
}

export default LectureItem;
