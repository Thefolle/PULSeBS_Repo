import React           from 'react';
import moment          from 'moment';
import Image           from 'react-bootstrap/Image';
// import context from 'react-bootstrap/esm/AccordionContext';
import { AuthContext } from './auth/AuthContext';

const BookingItem = ( props ) => {

  let {booking, cancelBooking, deleteWaitingAddBooking} = props;

  return (
    <AuthContext.Consumer>

        {(context)=>(
          <tr key={booking.id}>
              <td>{moment(new Date(booking.date)).format("YYYY-MM-DD")}</td>
              <td>{booking.course}</td>
              <td>{booking.class}</td>
              <td>{booking.presence === 1 ? "Presence" : "Remote"}</td>
              { booking.date>moment().valueOf()?
                <td><Image width="25" height="25" className="img-button" type="button" src="/svg/delete.svg" alt ="" onClick = {()=>{/*cancelBooking(context.authUser.id, booking.id);*/ deleteWaitingAddBooking(context.authUser.id, booking.ref_lecture,booking.id)}}/></td>
                :<td>
                        <Image width="30" height="30" className="img-button" type="button" src="/svg/forbid.svg" onClick= {() =>{ alert("This booking is passed") } }/>
                 </td>  //or undefined
              }
              
          </tr>
          )}

    </AuthContext.Consumer>
  );
}

export default BookingItem;
