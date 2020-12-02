import React, { useState } from 'react';
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';
import { Table } from "react-bootstrap";
import { AuthContext } from '../auth/AuthContext';
import Image from 'react-bootstrap/Image';
import { MdDeleteForever } from "react-icons/md"
import API from '../API/API.js';

import { FaBackward } from "react-icons/fa";

import '../customStyle.css';

const LectureList = (props) => {
  let { lectures, idc, cancelLecture } = props;
  let courseName;
  if (lectures.filter(l => l.id === parseInt(idc))[0] !== undefined) { // Avoid to loose courseName after reload: override variable only if available.
    courseName = lectures.filter(l => l.id === parseInt(idc))[0].course;
  }

  return (
    <AuthContext.Consumer>
      {(context) => (
        <>
          <Link id="goback" to={"/teacher/courses"}> <FaBackward /> </Link>
          <h4>{courseName}</h4>
          <Table className="table" id="lectures-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Presence</th>
                <th>Class</th>
                <th colSpan='2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lectures.filter(l => l.id === parseInt(idc)).map((l, id) => <LectureItem key={id} lecture={l} turnLectureIntoOnline={props.turnLectureIntoOnline} idc={idc} index={l.lecId} cancelLecture={ cancelLecture } />)}
            </tbody>
          </Table>
        </>
      )}
    </AuthContext.Consumer>
  );

}



const LectureItem = (props) => {
  let { lecture, turnLectureIntoOnline, idc, index, cancelLecture } = props;
  let [redirect, setRedirect] = useState('');

  if (redirect !== '') {
    return <Redirect to={redirect} />;
  }

  return (
    <AuthContext.Consumer>
      {(context) => (
        <>
    <tr onClick={() => setRedirect("/teacher/" + idc + "/lectures/" + index + "/students")}>
      <td>{moment(lecture.date).format("DD MMM YYYY")}</td>
      <td>{moment(lecture.date).format("HH:mm")}</td>
      <td>{moment(lecture.endTime).format("HH:mm")}</td>
      <td>{lecture.presence === 1 ? 'yes' : 'no'}</td>
      <td>{lecture.classC}</td>
      <td>
        {lecture.presence === 1 && lecture.active === 1 && moment(lecture.date).isAfter(moment().add(30, 'minute')) ?
        <Image width="50" height="50" className="img-button" type="button" src="/svg/fromPresenceToOnline2.png" alt=""
          onClick={() => turnLectureIntoOnline(index, context.authUser.id)}/>
        : undefined}
      </td>
      {moment(lecture.date).isAfter(moment().add(1, 'hours')) === true && lecture.active===1 ?
               <td><Image
                   width="25" height="25" className="img-button" type="button" src="/svg/delete.svg" alt ="" onClick = {()=>cancelLecture(context.authUser.id, lecture.lecId)}/>
               </td>  : <td><MdDeleteForever size={25}/></td>
            }
    </tr>
    </>
      )}
    </AuthContext.Consumer>
  );
}

export default LectureList;
