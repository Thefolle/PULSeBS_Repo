import React from 'react';
import { Table } from "react-bootstrap";
import { FaBackward } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import '../../style/customStyle.css';
import Tutorial from '../Tutorial';
import Lecture from './Lecture';


const LectureList = ( props ) => {
    let {lectures, idc, cancelLecture} = props;
    let courseName;
    if ( lectures.filter( l => l.id === parseInt( idc ) )[0] !== undefined ) { // Avoid to loose courseName after reload: override variable only if available.
        courseName = lectures.filter( l => l.id === parseInt( idc ) )[0].course;
    }

    return (
        <AuthContext.Consumer>
            { () => (
                <>
                    <Link id="goback" to={ "/teacher/courses" }> <FaBackward/> </Link>
                    <h4>{ courseName }</h4>
                    <Table className="table" id="lectures-table">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Presence</th>
                            <th>Classroom</th>
                            <th>
                            <Tutorial on={true} text={<p>If no action appears for a lecture, it cannot be given in virtual classroom.<br/> These are the typical reasons:
                                <ul>
                                    <li>The lecture is not active yet;</li>
                                    <li>The lecture is starting within 30 minutes;</li>
                                    <li>The lecture was already given.</li>
                                </ul>
                            </p>} push={
                                'Change to online'
                            } />
                            </th>
                            <th>Delete</th>
                            { <th>Take presence</th> }
                        </tr>
                        </thead>
                        <tbody>
                        { lectures.filter( l => l.id === parseInt( idc ) ).map( ( l, id ) => <Lecture key={ id }
                                                                                                          lecture={ l }
                                                                                                          turnLectureIntoOnline={ props.turnLectureIntoOnline }
                                                                                                          idc={ idc }
                                                                                                          index={ l.lecId }
                                                                                                          cancelLecture={ cancelLecture }/> ) }
                        </tbody>
                    </Table>
                </>
            ) }
        </AuthContext.Consumer>
    );

}

export default LectureList;
