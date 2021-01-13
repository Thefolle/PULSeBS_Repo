/**
 * @Feihong
 */

import React from 'react';
import { Table } from "react-bootstrap";
import { AuthContext } from '../../auth/AuthContext';
import ManageLecture from './ManageLecture';


const ManageLectures = (props) => {
    let {lecForFilter, updateBookableAttributForLecture} = props;
    
    return(
        <AuthContext.Consumer>
            {(context) => (
                <>
                
                <Table className = "table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Presence</th>
                            <th>Course</th>
                            <th>Class</th>
                            <th>Teacher</th>
                            <th>Bookable</th>
                            <th>Update Bookable</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lecForFilter.map( (l) => 
                        <ManageLecture key={l.id}
                                                 lecture={l}
                                                 updateBookableAttributForLecture={updateBookableAttributForLecture} />)}
                    </tbody>
                </Table>
                </>
            )}
        </AuthContext.Consumer>
    )
}

export default ManageLectures;