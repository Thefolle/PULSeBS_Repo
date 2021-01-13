/**
 * @Feihong
 */

import React       from 'react';
import WaitingItem from './WaitingItem';
import { Table }   from "react-bootstrap";
import {AuthContext} from '../../auth/AuthContext';

const WaitingList = ( props ) => {

    let { bookings} = props; //add delete method

    return (
      <AuthContext.Consumer>
            {(context)=>(
                <>
                <Table className="table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Course</th>
                        <th>Class</th>
                        <th>Presence</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>

                    { bookings.map( ( b ) => <WaitingItem key={ b.id } booking={ b } /> ) }

                    </tbody>
                </Table>
                
                </>
           )}
       </AuthContext.Consumer>

    );
}

export default WaitingList;
