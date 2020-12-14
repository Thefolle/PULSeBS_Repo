import React           from 'react';
import moment          from 'moment';
import Image           from 'react-bootstrap/Image';
// import context from 'react-bootstrap/esm/AccordionContext';
import { AuthContext } from './auth/AuthContext';

const BookingItem = ( props ) => {

    let {booking, cancelBooking} = props;

    return (
        <AuthContext.Consumer>
            { ( context ) => (
                <>
                    { booking.active === 1 ? <tr key={ booking.id }>
                        <td>{ moment( new Date( booking.date ) ).format( "YYYY-MM-DD" ) }</td>
                        <td>{ booking.course }</td>
                        <td>{ booking.class }</td>
                        <td>{ booking.presence === 1 ? "Presence" : "Remote" }</td>
                        <td><Image width="25" height="25" className="img-button" type="button" src="/svg/delete.svg"
                                   alt="" onClick={ () => cancelBooking( context.authUser.id, booking.id ) }/></td>
                    </tr> : null }
                </>

            ) }
        </AuthContext.Consumer>
    );
}

export default BookingItem;
