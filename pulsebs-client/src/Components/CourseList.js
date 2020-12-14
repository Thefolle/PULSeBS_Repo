import React, { useState }     from 'react';
import { Redirect }  from 'react-router-dom';
import { Table } from "react-bootstrap";
import {AuthContext} from '../auth/AuthContext';

const CourseList = ( props ) => {

  let {courses}=props;

    return (
      <AuthContext.Consumer>
            {(context)=>(
                <>
                  <Table className="table" id="lectures-table">
                      <thead>
                      <tr>
                          <th>Name</th>
                      </tr>
                      </thead>
                      <tbody>
                      { courses.map( ( c ) => <CourseItem key={ c.id } course={ c } index={ c.id }/> ) }
                      </tbody>
                  </Table>
                </>
            )}
      </AuthContext.Consumer>
    );
}

const CourseItem = ( props ) => {
    let {course, index} = props;
    let [redirect, setRedirect] = useState('');

    if (redirect !== '') {
        return <Redirect to={redirect} />
    }

    return (
        <tr onClick={() => setRedirect("/teacher/" + index + "/lectures")}>
            <td>{course.course}</td>
        </tr>

    );
}

export default CourseList;
