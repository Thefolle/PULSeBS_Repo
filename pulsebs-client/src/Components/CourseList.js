import React     from 'react';
import { Link }  from 'react-router-dom';
import { Table } from "react-bootstrap";

const CourseList = ( props ) => {
    let {courses, idc} = props;


    return (
        <Table className="table" id="lectures-table">
            <thead>
            <tr>
                <th>Name</th>
            </tr>
            </thead>
            <tbody>
            { courses.map( ( c, id ) => <CourseItem key={ id } course={ c } index={ idc[id] }/> ) }
            </tbody>
        </Table>
    );
}

const CourseItem = ( props ) => {
    let {course, index} = props;

    return (
        <tr>
            <td><Link to={ "/teacher/" + index + "/lectures" }>{ course }</Link></td>
        </tr>

    );
}

export default CourseList;