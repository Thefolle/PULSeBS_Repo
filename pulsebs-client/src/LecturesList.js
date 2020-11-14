import React from 'react';
import LectureItem from './LectureItem';

const LecturesList = (props) => {

  let {lectures, bookSeat} = props;

  return(
        <>
          {lectures.length!==0 && 
            <table className="table" id="lectures-table">
              <thead>
              <tr>
                <th>Id</th>
                <th>Date</th>
                <th>Presence</th>
                <th>Course</th>
                <th>Teacher</th>  
                <th></th>              
              </tr>
              </thead>
              <tbody>
                {lectures.map((l) => <LectureItem key={l.id} lecture = {l} bookSeat = {bookSeat} 
                                                /> )}      
              </tbody>     
            </table>   
             }
           </>      
  );
}

export default LecturesList;
