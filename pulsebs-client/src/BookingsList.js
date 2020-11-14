import React from 'react';
import BookingItem from './BookingItem';

const BookingsList = (props) => {

  let {bookings} = props; //add delete method

  return(
        <>
          {bookings.length!==0 && 
            <table className="table">
              <thead>
              <tr>
                <th>Date</th>
                <th>Course</th>
                <th></th>              
              </tr>
              </thead>
              <tbody>
                {bookings.map((b) => <BookingItem booking = {b} 
                                                /> )}      
              </tbody>     
            </table>   
             }
           </>      
  );
}

export default BookingsList;
