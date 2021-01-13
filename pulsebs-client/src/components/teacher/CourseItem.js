import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import Tutorial from '../Tutorial';

const CourseItem = (props) => {
    let { course, index } = props;
    let [redirect, setRedirect] = useState('');

    if (redirect !== '') {
        return <Redirect to={redirect} />
    }

    return (
        <tr onClick={() => setRedirect("/teacher/" + index + "/lectures")}>
            <td>
                <Tutorial on={true} text='Click on this course if you want to view its lectures and their bookings.' push={
                    course.course
                } />
            </td>
        </tr>

    );
}

export default CourseItem;