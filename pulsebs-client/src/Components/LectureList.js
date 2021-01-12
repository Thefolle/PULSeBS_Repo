import React, { useState }  from 'react';
import moment               from 'moment';
import { Link, Redirect }   from 'react-router-dom';
import { Table }            from "react-bootstrap";
import { AuthContext }      from '../auth/AuthContext';
import Image                from 'react-bootstrap/Image';
import { MdDeleteForever }  from "react-icons/md"
import { FaBackward }       from "react-icons/fa";

import Tutorial from './Tutorial';

import '../customStyle.css';
import { BsFillPeopleFill } from "react-icons/bs";
import { ImCross }          from "react-icons/im";

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
                        { lectures.filter( l => l.id === parseInt( idc ) ).map( ( l, id ) => <LectureItem key={ id }
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


const LectureItem = ( props ) => {
    let {lecture, turnLectureIntoOnline, idc, index, cancelLecture} = props;
    let [ redirect, setRedirect ] = useState( '' );

    if ( redirect !== '' ) {
        return <Redirect to={ redirect }/>;
    }

    return (
        <AuthContext.Consumer>
            { ( context ) => (
                <>
                    <tr onClick={ ( event ) => {
                        console.log( event.currentTarget.tagName );
                        if ( event.currentTarget.tagName === 'TR' ) {
                            setRedirect( "/teacher/" + idc + "/lectures/" + index + "/students" );
                        }
                    } }>
                        <td>{ moment( lecture.date ).format( "DD MMM YYYY" ) }</td>
                        <td>{ moment( lecture.date ).format( "HH:mm" ) }</td>
                        <td>{ moment( lecture.endTime ).format( "HH:mm" ) }</td>
                        <td>{ lecture.presence === 1 ? 'yes' : 'no' }</td>
                        <td>{ lecture.classC }</td>
                        <td>
                            { lecture.presence === 1 && lecture.active === 1 && moment( lecture.date ).isAfter( moment().add( 30, 'minute' ) ) ?
                                <Tutorial on={true} text={<p>Click here if this lecture has to be given in virtual classroom. Students will be automatically notified through an email.<br/>Beware that the lecture <i>cannot be turned back</i> into a presence one.</p>} push={
                                    <Image width="50" height="50" className="img-button" type="button"
                                       src="/svg/changeToVirtual.svg" alt=""
                                       onClick={ ( event ) => {
                                           event.stopPropagation();
                                           turnLectureIntoOnline( index, context.authUser.id );
                                       }
                                    }/>
                                } />
                            : null }
                        </td>
                        { moment( lecture.date ).isAfter( moment().add( 1, 'hours' ) ) === true && lecture.active === 1 ?
                            <td>
                                <Tutorial on={true} text={<p>Delete this lecture <i>permanently</i>.</p>}
                                push={
                                    <Image
                                        width="25" height="25" className="img-button" type="button" src="/svg/delete.svg" alt=""
                                        onClick={ ( event ) => {
                                            event.stopPropagation();
                                            cancelLecture( context.authUser.id, lecture.lecId )
                                        }
                                    }/>
                                } />
                            </td> :
                            <td>
                                <Tutorial on={true} text={<p>The lecture cannot be deleted anymore.</p>}
                                push={
                                    <MdDeleteForever size={ 25 }/>
                                } />
                            </td>
                        }
                        <td>
                            { moment().isAfter( moment( lecture.date ) ) && moment().isBefore( moment( lecture.endTime ) ) ?
                                <Link to={`/teacher/${idc}/lecture/${lecture.lecId}/presence`}>
                                    <Tutorial on={true} text={<p>Take note of the students who attended this lecture in presence.</p>} push={
                                        <BsFillPeopleFill color={ "green" } size={ "1.5em" }/>
                                    } />
                                </Link> :
                                <Tutorial on={true} text='It is not possible to take note of the students who attended this lecture anymore, since it terminated.' push={
                                    <ImCross/>
                                } />
                            }
                        </td>
                    </tr>
                </>
            ) }
        </AuthContext.Consumer>
    );
}

export default LectureList;
