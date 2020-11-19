import React       from 'react';
import BookingItem from './BookingItem';
import { Table }   from "react-bootstrap";

const BookingsList = ( props ) => {

    let {bookings, cancelBooking} = props; //add delete method

    return (
            <Table className="table">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Course</th>
                    <th>Class</th>
                    <th>Presence</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                { bookings.map( ( b ) => <BookingItem booking={ b } cancelBooking={cancelBooking} /> ) }
                </tbody>
            </Table>

    );
}

export default BookingsList;
