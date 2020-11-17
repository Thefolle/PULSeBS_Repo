import React from 'react';
import {Link} from 'react-router-dom';

const CourseList=(props)=>{
    let {courses,idc}=props;
    

   return(
       <>
       {courses.length!==0 &&
        <table className="table" id="lectures-table">
              <thead>
              <tr>
                <th>Name</th>
              </tr>
              </thead>
              <tbody>
                {courses.map((c,id) => <CourseItem key={id} course = {c} index={idc[id]}/> )}      
              </tbody>     
            </table>
            }
       </>
       );
    
}

const CourseItem=(props)=>{
    let {course,index}=props;

    return(
        <tr>
          <td> <Link to={"/teacher/" + index + "/lectures"}>{course}</Link></td>
        </tr>
        
       );
}

export default CourseList;