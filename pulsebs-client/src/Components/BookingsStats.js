import React from 'react';
import { Table } from "react-bootstrap";
import { AuthContext } from '../auth/AuthContext';
import moment from 'moment';

/*
Type 0: attendances
Type 1: bookings
Type 2: cancelled lectures
Type 3: cancelled bookings
 */

const BookingsStats = (props) => {
    let { bookings,type } = props;
    return (
        <AuthContext.Consumer>
            {(context) => (
                <>
                 {type===1 && <h3>Bookings</h3>}
                 {type===0 && <h3>Attendances</h3>}
                 {type===2 && <h3>Cancelled lectures</h3>}
                 {type===3 && <h3>Cancelled bookings</h3>}
                    {type===1 && bookings.length === 0 &&
                        <h5>no bookings in the system.</h5>
                    }
                    {type===0 && bookings.length === 0 &&
                        <h5>no attendances in the system.</h5>
                    }
                    {type===2 && bookings.length === 0 &&
                        <h5>no cancelled lectures in the system.</h5>
                    }
                    {type===3 && bookings.length === 0 &&
                        <h5>no cancelled bookings in the system.</h5>
                    }
                    { bookings.length !== 0 &&
                        <>
                            <Table className="table" id="lectures-table">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Name</th>
                                        <th>Surname</th>
                                        <th>Course</th>
                                        <th>Lecture</th>
                                        <th>Data</th>
                                        <th>TimeStart</th>
                                        <th>TimeEnd</th>
                                        <th>Class</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((b, id) =>
                                            <BookingsStatsItem key={id} booking={b} />
                                        )}
                                </tbody>
                            </Table>
                        </>
                    }
                </>
            )}
        </AuthContext.Consumer>
    );

}

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

export default BookingsStats;