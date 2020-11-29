import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Table } from "react-bootstrap";
import { AuthContext } from '../auth/AuthContext';
import Image from 'react-bootstrap/Image';
import API from '../API/API.js';

import '../customStyle.css';

const LectureList = (props) => {
  let { lectures, idc } = props;
  let courseName;
  if (lectures.filter(l => l.id === parseInt(idc))[0] != undefined) { // Avoid to loose courseName after reload: override variable only if available.
    courseName = lectures.filter(l => l.id === parseInt(idc))[0].course;
  }

  return (
    <AuthContext.Consumer>
      {(context) => (
        <>
          <Table className="table" id="lectures-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Presence</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lectures.filter(l => l.id === parseInt(idc)).map((l, id) => <LectureItem key={id} lecture={l} idc={idc} index={l.lecId} />)}
            </tbody>
          </Table>
        </>
      )}
    </AuthContext.Consumer>
  );

}

let turnLectureIntoOnline = (lectureId, teacherId) => {
  API.turnLectureIntoOnline(lectureId, teacherId).then(result => {
    console.log(result);
  }).catch(error => {
    console.log(error);
  });
}

const LectureItem = (props) => {
  let { lecture, idc, index } = props;

  return (
    <tr>
      <td><Link to={"/teacher/" + idc + "/lectures/" + index + "/students"}>{moment(lecture.date).format("DD MMM YYYY")}</Link></td>
      <td><Link to={"/teacher/" + idc + "/lectures/" + index + "/students"}>{moment(lecture.date).format("HH:mm")}</Link></td>
      <td><Link to={"/teacher/" + idc + "/lectures/" + index + "/students"}>{lecture.presence === 1 ? 'yes' : 'no'}</Link></td>
      <td><Link to={"/teacher/" + idc + "/lectures/" + index + "/students"}>{lecture.classC}</Link></td>
      <td>
        {lecture.presence === 1 ?
        <Image width="50" height="50" className="img-button" type="button" src="/svg/fromPresenceToOnline2.png" alt=""
          onClick={() => turnLectureIntoOnline(index)}/>
        : undefined}
      </td>
    </tr>
  );
}

export default LectureList;
