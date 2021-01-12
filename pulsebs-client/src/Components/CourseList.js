import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Table } from "react-bootstrap";
import { AuthContext } from '../auth/AuthContext';

import Tutorial from './Tutorial';

const CourseList = (props) => {

    let { courses } = props;

    return (
        <AuthContext.Consumer>
            {() => (
                <>
                    <Table className="table" id="lectures-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((c) => <CourseItem key={c.id} course={c} index={c.id} />)}
                        </tbody>
                    </Table>
                </>
            )}
        </AuthContext.Consumer>
    );
}

const CourseItem = (props) => {
    let { course, index } = props;
    let [redirect, setRedirect] = useState('');

    if (redirect !== '') {
        return <Redirect to={redirect} />
    }

    return (
        <tr onClick={() => setRedirect("/teacher/" + index + "/lectures")}>
            <td>
                <Tutorial on={true} text='Click on this course if you want to view its lectures and their bookings.' push={
                    course.course
                } />
            </td>
        </tr>

    );
}

export default CourseList;
