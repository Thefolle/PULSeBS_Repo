import React from 'react';
import moment from 'moment';
import Image from 'react-bootstrap/Image';

const BookingItem = (props) => {

  let {booking, cancelBooking} = props;

  return (
    <tr key={booking.id}>
      <td>{moment(new Date(booking.date)).format("YYYY-MM-DD")}</td>
        <td>{booking.course}</td>
        <td>{booking.class}</td>
        <td>{booking.presence === 1 ? "Presence" : "Remote"}</td>
       <td><Image width="30" height="30" className="img-button" type="button" src="/svg/delete.svg" alt ="" onClick = {() => cancelBooking(booking.id)}/></td>
   </tr>
  );
}

export default BookingItem;
