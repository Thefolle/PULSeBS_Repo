import React from 'react';
import LectureItem from './LectureItem';
import { Table } from "react-bootstrap";
import { AuthContext } from './auth/AuthContext';

const LecturesList = (props) => {

    let {waitings, lectures, bookings, bookSeat, addStudentToWaitingList, alreadyBooked } = props;

    return (
      <AuthContext.Consumer>
            {(context)=>(
              <>
                { lectures.length !== 0 &&
                <Table className="table" id="lectures-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Presence</th>
                        <th>Course</th>
                        <th>Class</th>
                        <th>Teacher</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                      {/* TODO: map waitings */}
                    { lectures.map( ( l ) => <LectureItem key={ l.id } lecture={ l } waitings = {waitings} bookings={bookings} bookSeat={ bookSeat } addStudentToWaitingList={addStudentToWaitingList} alreadyBooked={ alreadyBooked } /> ) }
                    </tbody>
                </Table>
                }
              </>
            )}
      </AuthContext.Consumer>
    );
}

export default LecturesList;
