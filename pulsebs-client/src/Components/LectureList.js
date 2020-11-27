import React    from 'react';
import moment   from 'moment';
import { Link } from 'react-router-dom';
import { Table }    from "react-bootstrap";
import { AuthContext } from '../auth/AuthContext';

const LectureList = ( props ) => {
  let {lectures,idc } = props;

    return (
      <AuthContext.Consumer>
          {(context)=>(
           <>
            <Table className="table" id="lectures-table">
                <thead>
                <tr>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                { lectures.filter(l=>l.id===parseInt(idc)).map( ( l, id ) => <LectureItem key={ id } lecture={ l } idc={ idc } index={ l.lecId }/> ) }
                </tbody>
            </Table>
            </>
          )}
        </AuthContext.Consumer>
    );

}

const LectureItem = ( props ) => {
    let {lecture, idc, index} = props;

    return (

        <tr>
            <td><Link
                to={ "/teacher/" + idc + "/" + index + "/students" }>{ moment( lecture.date ).format( "DD MMM YYYY HH:mm" ) }</Link>
            </td>
        </tr>

    );
}

export default LectureList;
