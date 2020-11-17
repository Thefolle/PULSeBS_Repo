import React from 'react';
import moment from 'moment';
import {Link} from 'react-router-dom';

const LectureList = (props) => {
    let { lectures,idc} = props;

    return (
        <>
            {lectures.length !== 0 &&
                <table className="table" id="lectures-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lectures.map((l, id) => <LectureItem key={id} lecture={l}  idc={idc} index={l.lecId} />)}
                    </tbody>
                </table>
            }
        </>
    );

}

const LectureItem = (props) => {
    let { lecture,idc,index} = props;

    return(
        
            <tr>
            <td><Link to={"/teacher/" + idc + "/" + index + "/students"}>{moment(lecture.date).format("DD MMM YYYY HH:mm")}</Link></td>
            </tr>
        
    );
}

export default LectureList;