import React    from 'react';
import moment   from 'moment';
import { Link } from 'react-router-dom';
import { Table }    from "react-bootstrap";
import { AuthContext } from '../auth/AuthContext';
import Image from 'react-bootstrap/Image';
import { MdDeleteForever } from "react-icons/md"

const LectureList = ( props ) => {
  let {lectures, idc, cancelLecture } = props;
  let courseName;
  if(lectures.filter(l=>l.id===parseInt(idc))[0] !== undefined) { // Avoid to loose courseName after reload: override variable only if available.
    courseName = lectures.filter(l=>l.id===parseInt(idc))[0].course;
  }

  return (
    <AuthContext.Consumer>
        {(context)=>(
         <>
          <Table className="table" id="lectures-table">
              <thead>
              <tr>
                  <th>{ courseName }</th>
                  <th></th>
              </tr>
              </thead>
              <tbody>
              { lectures.filter(l=>l.id===parseInt(idc)).map( ( l, id ) => <LectureItem key={ id } lecture={ l } idc={ idc } index={ l.lecId } cancelLecture={ cancelLecture }/> ) }
              </tbody>
          </Table>
          </>
        )}
      </AuthContext.Consumer>
    );

}

const LectureItem = ( props ) => {
    let {lecture, idc, index, cancelLecture} = props;

    return (

        <tr>
            <td><Link
                to={ "/teacher/" + idc + "/lectures/" + index + "/students" }>
                  [{lecture.lecId}] { moment( lecture.date ).format( "DD MMM YYYY HH:mm" ) }-
                    {moment( lecture.endTime ).add(1.5, "hours").format( "HH:mm" )} | Classroom: {lecture.classC}
                </Link>
              </td>
            {moment(lecture.date).isAfter(moment().add(1, 'hours')) && lecture.active===1 ?
               <td><Image
                   width="25" height="25" className="img-button" type="button" src="/svg/delete.svg" alt ="" onClick = {()=>cancelLecture(lecture.lecId)}/>
               </td>  : <td><MdDeleteForever size={25}/></td>
            }
  
        </tr>

    );
}

export default LectureList;
