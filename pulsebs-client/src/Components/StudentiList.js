import React     from 'react';
import { Table } from "react-bootstrap";

const StudentList = ( props ) => {
    let {students,idl,getLectures } =props;
    //getLectures();
    //let student = students.filter( e => e.lId === parseInt( idl ) );
    return (
        <Table className="table" id="lectures-table">
            <thead>
            <tr>
                <th>Id</th>
            </tr>
            </thead>
            <tbody>
            { students.filter( e => e.lId === parseInt( idl ) )
              .map( ( s, id ) => <StudentItem key={ id } student={ s }/> ) }
            </tbody>
        </Table>
    );

}

const StudentItem = ( props ) => {
    let {student} = props;

    return (
        <tr>
            <td>{ student.studentId }</td>
        </tr>
    );
}

export default StudentList;
