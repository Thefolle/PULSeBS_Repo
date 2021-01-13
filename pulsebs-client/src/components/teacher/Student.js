import React from 'react';
import Tutorial from '../Tutorial';


const Student = (props) => {
    let { student } = props;

    return (
        <tr>
            <td>
                <Tutorial on={true} text='This student is currently booked for the lecture.' push={
                    student.studentId
                } />
            </td>
        </tr>
    );
}

export default Student;