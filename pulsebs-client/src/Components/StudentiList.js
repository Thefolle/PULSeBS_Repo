import React from 'react';

const StudentList =(props) => {
    let { students,idl } =props;
    let student=students.filter(e=>e.lId===parseInt(idl));
    return (
        <>
        
            {student.length !== 0 &&
                <table className="table" id="lectures-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {student.map((s, id) => <StudentItem key={id} student={s} />)}
                    </tbody>
                </table>
            }
        </>
    );

}

const StudentItem = (props) => {
    let {student} = props;

    return (
            <tr>
                <td>{student.studentId}</td>
            </tr>
    );
}

export default StudentList;