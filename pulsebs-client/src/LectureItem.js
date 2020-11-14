import React from 'react';
import moment from 'moment';
import Image from 'react-bootstrap/Image';

const LectureItem = (props) => {

  let {lecture, bookSeat} = props;


  return (
    <tr>
      <td>{lecture.id}</td>
      <td>{moment(new Date(lecture.date)).format("YYYY-MM-DD")}</td>
      {lecture.presence===1 && <td>yes</td>}
      {lecture.presence===0 && <td>no</td>}
      <td>{lecture.course}</td>
      <td>{lecture.teacherName + " " + lecture.teacherSurname}</td> 
      {lecture.bookable &&
       <td><Image width="30" height="30" className="img-button" src="/svg/calendar.svg" alt ="" onClick={() => bookSeat(lecture)}/></td>   
      }
   </tr>
  );
}

export default LectureItem;
