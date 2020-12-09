import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from "react-bootstrap";
import { AuthContext } from '../auth/AuthContext';
import moment from 'moment';


const BookingsStats = (props) => {
    let { bookings,type } = props;
    return (
        <AuthContext.Consumer>
            {(context) => (
                <>
                 {type===1 && <h3>Booking stats</h3>}
                 {type===0 && <h3>Attendance stats</h3>}
                    {type===1 && bookings.length === 0 &&
                        <h5>no bookings in the system.</h5>
                    }
                    {type===0 && bookings.length === 0 &&
                        <h5>no attendances in the system.</h5>
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
                                        <th>dataStart</th>
                                        <th>dataFinish</th>
                                        <th>class</th>
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
            <td>{booking.studentId}</td>
            <td>{booking.studentName}</td>
            <td>{booking.studentSurname}</td>
            <td>{booking.course}</td>
            <td>{moment(new Date(booking.dataStart)).format("YYYY-MM-DD HH:mm")}</td>
            <td>{moment(new Date(booking.dataFinish)).format("YYYY-MM-DD HH:mm")}</td>
            <td>{booking.classC}</td>
        </tr>
    );
}

export default BookingsStats;