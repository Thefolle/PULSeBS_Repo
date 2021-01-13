import React from 'react';
import moment from 'moment';

const BookingsStatsItem = (props) => {
    let { booking } = props;

    return (
        <tr>
            <td>{booking.userId}</td>
            <td>{booking.userName}</td>
            <td>{booking.userSurname}</td>
            <td>{booking.course}</td>
            <td>{booking.lecId}</td>
            <td>{moment(new Date(booking.dataStart)).format("YYYY-MM-DD")}</td>
            <td>{moment(new Date(booking.dataStart)).format("HH:mm")}</td>
            <td>{moment(new Date(booking.dataFinish)).format("HH:mm")}</td>
            <td>{booking.classC}</td>
        </tr>
    );
}

export default BookingsStatsItem;