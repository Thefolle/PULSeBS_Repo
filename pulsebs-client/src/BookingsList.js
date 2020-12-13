import React       from 'react';
import BookingItem from './BookingItem';
import WaitingItem from './Components/waitings/WaitingItem'
import { Table }   from "react-bootstrap";
import {AuthContext} from './auth/AuthContext';

const BookingsList = ( props ) => {

    let {deleteWaitingAddBooking, waitings, bookings, cancelBooking} = props; //add delete method

    return (
      <AuthContext.Consumer>
            {(context)=>(
                <>
                <h2>Bookings</h2>
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

                    { bookings.map( ( b ) => <BookingItem key={ b.id } booking={ b } deleteWaitingAddBooking={deleteWaitingAddBooking} cancelBooking={cancelBooking} /> ) }

                    </tbody>
                </Table>
                <h2>Waitings</h2>
                <Table className="table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Course</th>
                        <th>Class</th>
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
