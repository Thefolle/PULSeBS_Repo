import React from 'react';
import { Table } from "react-bootstrap";
import { FaBackward } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import StudentItem from './StudentItem';


const StudentList = (props) => {
    let { students, idl, idc } = props;

    //let student = students.filter( e => e.lId === parseInt( idl ) );
    return (
        <AuthContext.Consumer>
            {() => (
                <>
                    <Link id="goback" to={`/teacher/${idc}/lectures`}> <FaBackward /> </Link>
                    { students.filter(e => e.lId === parseInt(idl)).length === 0 &&
                        <h5>no students booked for this lecture.</h5>
                    }
                    { students.filter(e => e.lId === parseInt(idl)).length !== 0 &&
                        <>
                            <Table className="table" id="lectures-table">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.filter(e => e.lId === parseInt(idl))
                                        .map((s, id) =>
                                            <StudentItem key={id} student={s} />
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

export default StudentList;
