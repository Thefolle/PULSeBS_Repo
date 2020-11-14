import React from 'react';
import moment from 'moment';
import Image from 'react-bootstrap/Image';

const BookingItem = (props) => {

  let {booking} = props;


  return (
    <tr>
      <td>{moment(new Date(booking.date)).format("YYYY-MM-DD")}</td>
      <td>{booking.ref_lecture}</td>
       <td><Image width="30" height="30" className="img-button" src="svg/delete.svg" alt =""/></td>   
   </tr>
  );
}

export default BookingItem;
