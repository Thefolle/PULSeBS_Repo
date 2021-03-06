import moment from 'moment';
import React from 'react';
import Image from 'react-bootstrap/Image';
import { AuthContext } from '../../auth/AuthContext';
import Tutorial from '../Tutorial';


const Lecture = ( props ) => {

    let {lecture, waitings, bookings, bookSeat, addStudentToWaitingList, alreadyBooked, alreadyWaited, deleteWaitingAddBooking, getBookingId} = props;

    alreadyBooked = (lectureId) => {
            const ids = bookings.map((b) => b.ref_lecture );
            if(ids.includes(lectureId) === true)
              return 1;
            else
              return 0;
    }

    alreadyWaited = (lectureId) => {
        const ids = waitings.map( (w) => w.ref_lecture);
        if( ids.includes(lectureId) === true)
            return 1;
        else 
            return 0;
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

                    {alreadyWaited(lecture.id) === 0 && lecture.bookable === 1 && alreadyBooked(lecture.id) === 0 && lecture.date > moment().valueOf() ?
                    <td>
                        <Tutorial on={true} text={<p>Book a seat. It is immediately available for you.<br/>The booking will be available in the bookings tab.</p>} push={
                            <Image width="30" height="30" className="img-button" type="button" src="/svg/calendar.svg" alt="" onClick={ () => bookSeat(context.authUser.id, lecture.id ) }/>
                        } />
                    </td> : 
                    // TODO: Merge Waiting column to actions 
                    // TODO: check there is seats or not
                   alreadyWaited(lecture.id) === 1|| (alreadyBooked(lecture.id) === 1 && lecture.date > moment().valueOf()) || lecture.date < moment().valueOf() ?
                    <td>
                        <Tutorial on={true}
                        text={<p>This lecture cannot be booked, typically for these reasons:
                            <ul>
                                <li>It is already booked: check the bookings tab;</li>
                                <li>It is already in the waiting list: check the waitings tab;</li>
                                <li>It's a past lecture.</li>
                            </ul>
                        </p>}
                        push={
                            <Image width="30" height="30" className="img-button" type="button" src="/svg/forbid.svg" onClick= {() =>{ alert("You can not book this lecture!") } }/>
                        } />
                    </td> :
                        /*do something if it fails*/
                    <td>
                        <Tutorial on={true} text={<p>Book this lecture if a seat will become available. For now, the bookings will be added only to a waiting list. In that case, your booking will be automatically accepted.<br/>The booking will be available in the bookings tab.</p>} push={
                            <Image width="30" height="30" className="img-button" type="button" src="/svg/add.svg" alt=""
                                onClick={ () => addStudentToWaitingList(context.authUser.id, lecture.id ) }/>
                        } />
                    </td>
                    
                    }
                    {alreadyBooked(lecture.id) && lecture.date > moment().valueOf() ?
                         <td>
                             <Tutorial on={true} text={<p>Cancel the booking.<br/>It will be removed either from the waiting list or the bookings.</p>} push={
                                <Image width="25" height="25" className="img-button" type="button" src="/svg/delete.svg" alt ="" onClick = {() => { 
                                    deleteWaitingAddBooking(context.authUser.id, lecture.id, getBookingId(lecture.id) ) } }/>
                             } />
                         </td> : <td></td>
                    }
                </tr>
            </>
             )}
        </AuthContext.Consumer>
    );
}

export default Lecture;
