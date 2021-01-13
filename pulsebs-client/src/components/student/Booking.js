import moment from 'moment';
import React from 'react';
import Image from 'react-bootstrap/Image';
import { AuthContext } from '../../auth/AuthContext';
import Tutorial from '../Tutorial';

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
                <td>
                  <Tutorial on={true} text={<p>Cancel the booking.<br/>It will be available again in the lectures tab.</p>} push={
                    <Image width="25" height="25" className="img-button" type="button" src="/svg/delete.svg" alt ="" onClick = {()=>{/*cancelBooking(context.authUser.id, booking.id);*/ deleteWaitingAddBooking(context.authUser.id, booking.ref_lecture,booking.id)}}/>
                  } />
                </td>
                :<td>
                  <Tutorial on={true} text={<p>The lecture which this booking refers to was already given. You cannot therefore delete it anymore.</p>} push={
                    <Image width="30" height="30" className="img-button" type="button" src="/svg/forbid.svg" onClick= {() =>{ alert("This booking is passed") } }/>
                  } />
                  </td>  //or undefined
              }
              
          </tr>
          )}

    </AuthContext.Consumer>
  );
}

export default BookingItem;
