/**
 * @Feihong
 */

import React from 'react';
import moment from 'moment';
import {AuthContext} from '../../auth/AuthContext';

const Waiting = (props) => {

  let {waiting } = props;

  return (
    <AuthContext.Consumer>

        {(context)=>(
          
          <tr key={waiting.id}>
            <td>{moment(new Date(waiting.lecdate)).format("YYYY-MM-DD")}</td>
            <td>{waiting.desc}</td>
            <td>{waiting.cldesc}</td>
            <td>{waiting.presence === 1 ? "Presence" : "Remote"}</td>
            <td>{moment(new Date(waiting.date)).format("YYYY-MM-DD")}</td>
          </tr>
          )}

    </AuthContext.Consumer>
  );
}

export default Waiting;
