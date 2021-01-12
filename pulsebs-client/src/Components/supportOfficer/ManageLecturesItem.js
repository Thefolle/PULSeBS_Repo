/**
 * @Feihong
 */

import React from 'react';
import moment from 'moment';
import {AuthContext} from '../../auth/AuthContext';
import Button from 'react-bootstrap/Button'


const ManageLecturesItem = (props) => {

  let {lecture, updateBookableAttributForLecture } = props;



  return (
    <AuthContext.Consumer>

        {(context)=>(
          
          <tr key={lecture.id}>
            <td>{moment(new Date(lecture.date)).format("YYYY-MM-DD")}</td>
            <td>{ moment( new Date( lecture.date ) ).format( "HH:mm" ) }</td>
            { lecture.presence === 1 && <td>yes</td> }
            { lecture.presence === 0 && <td>no</td> }
            <td>{ lecture.courseDesc }</td>
            <td>{ lecture.classDesc }</td>
            <td>{ lecture.teacherName + " " + lecture.teacherSurname }</td>
            { lecture.bookable === 1 && <td>yes</td> }
            { lecture.bookable === 0 && <td>no</td> }
            <td> 
                {lecture.date < moment().valueOf()? 
                    <Button variant="dark" size="small" onClick={()=>{alert("You can not operate the lecture, because the lecture is out of time")}}>Outdate</Button>
                    : lecture.bookable === 0 ? 
                    <Button variant="success" size="small" onClick = {() => {updateBookableAttributForLecture(lecture.id, lecture.bookable);} }>Active</Button> 
                    : <Button variant="danger" size="small" onClick = {() =>{ updateBookableAttributForLecture(lecture.id, lecture.bookable); }}>Deactive</Button>
                }
            </td>
          </tr>
          )}

    </AuthContext.Consumer>
  );
}

export default ManageLecturesItem;