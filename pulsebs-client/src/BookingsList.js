import React       from 'react';
import BookingItem from './BookingItem';
import WaitingItem from './Components/waitings/WaitingItem'
import { Table }   from "react-bootstrap";
import {AuthContext} from './auth/AuthContext';

import Tutorial from './Components/Tutorial';

const BookingsList = ( props ) => {

    let {deleteWaitingAddBooking, waitings, bookings, cancelBooking} = props; //add delete method

    return (
      <AuthContext.Consumer>
            {()=>(
                <>
                
                <Tutorial on={true} text='Here immediately follows the list of bookings that were accepted; for each of them a seat is reserved for you.' push={
                    <h2>Bookings</h2>
                } />
                <Table className="table">
                    
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Course</th>
                        <th>Classroom</th>
                        <th>Presence</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>

                    { bookings.map( ( b ) => <BookingItem key={ b.id } booking={ b } deleteWaitingAddBooking={deleteWaitingAddBooking} cancelBooking={cancelBooking} /> ) }

                    </tbody>
                </Table>
                <Tutorial on={true} text={<p>Here immediately follows the list of bookings that will be accepted as soon as a seat becomes available.<br/>In that case, the system will automatically reserve a seat for you and the booking will so be moved into the bookings list.</p>} push={
                    <h2>Waiting list</h2>
                } />
                <Table className="table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Course</th>
                        <th>Classroom</th>
                        <th>Presence</th>
                        <th>Add Date</th>
                    </tr>
                    </thead>
                    <tbody>

                    { waitings.map( ( w ) => <WaitingItem key={ w.id } waiting={ w } /> ) }

                    </tbody>
                </Table>
                </>
           )}
       </AuthContext.Consumer>

    );
}

export default BookingsList;
