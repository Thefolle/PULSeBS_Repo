import React from 'react';
import { Table } from "react-bootstrap";
import { AuthContext } from '../../auth/AuthContext';
import Course from './Course';


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
                            {courses.map((c) => <Course key={c.id} course={c} index={c.id} />)}
                        </tbody>
                    </Table>
                </>
            )}
        </AuthContext.Consumer>
    );
}

export default CourseList;
