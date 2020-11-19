import React     from 'react';
import { Link }  from 'react-router-dom';
import { Table } from "react-bootstrap";

const CourseList = ( props ) => {
  let {courses,getLectures}=props;
  getLectures();


    return (
        <Table className="table" id="lectures-table">
            <thead>
            <tr>
                <th>Name</th>
            </tr>
            </thead>
            <tbody>
            { courses.map( ( c ) => <CourseItem key={ c.id } course={ c } index={ c.id }/> ) }
            </tbody>
        </Table>
    );
}

const CourseItem = ( props ) => {
    let {course, index} = props;

    return (
        <tr>
            <td><Link to={ "/teacher/" + index + "/lectures" }>{ course.course }</Link></td>
        </tr>

    );
}

export default CourseList;
