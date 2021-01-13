import React from 'react';
import moment      from 'moment';
import LectureItem from './LectureItem';
import { Table } from "react-bootstrap";
import { AuthContext } from '../../auth/AuthContext';

import Tutorial from '../Tutorial';

const LecturesList = (props) => {

    let {waitings, lectures, bookings, bookSeat, addStudentToWaitingList, alreadyBooked, deleteWaitingAddBooking, getBookingId } = props;

    return (
      <AuthContext.Consumer>
            {(context)=>(
              <>
              <Tutorial on={true} text='Here immediately follows the list of lectures in next days. You can also perform some actions on them.' push={
                    <h2>Lectures</h2>
              } />
                { lectures.length !== 0 &&
                <Table className="table" id="lectures-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Presence</th>
                        <th>Course</th>
                        <th>Classroom</th>
                        <th>Teacher</th>
                        <th>Book</th>
                        <th>Unbook</th>
                    </tr>
                    </thead>
                    <tbody>
                      {/* TODO: map waitings */}
                    { lectures
                        .filter((l) => !(moment(l.date).isBefore(new Date())))
                        .map( ( l ) => <LectureItem key={ l.id } lecture={ l } waitings = {waitings} bookings={bookings} bookSeat={ bookSeat } addStudentToWaitingList={addStudentToWaitingList} alreadyBooked={ alreadyBooked } deleteWaitingAddBooking={ deleteWaitingAddBooking } getBookingId={getBookingId} /> ) }
                    </tbody>
                </Table>
                }
              </>
            )}
      </AuthContext.Consumer>
    );
}

export default LecturesList;
