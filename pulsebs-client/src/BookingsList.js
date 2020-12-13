import React       from 'react';
import BookingItem from './BookingItem';
import { Table }   from "react-bootstrap";
import {AuthContext} from './auth/AuthContext';

const BookingsList = ( props ) => {

    let {bookings, cancelBooking} = props; //add delete method

    return (
      <AuthContext.Consumer>
            {(context)=>(
                <>
                <Table className="table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Course</th>
                        <th>Class</th>
                        <th>Presence</th>
                        <th>Actions</th>
                        <th>WaitingList</th>
                    </tr>
                    </thead>
                    <tbody>

                    { bookings.map( ( b ) => <BookingItem key={ b.id } booking={ b } cancelBooking={cancelBooking} /> ) }

                    </tbody>
                </Table>
                </>
           )}
       </AuthContext.Consumer>

    );
}

export default BookingsList;
