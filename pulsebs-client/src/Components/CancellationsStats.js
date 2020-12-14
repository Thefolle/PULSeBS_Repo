import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from "react-bootstrap";
import { AuthContext } from '../auth/AuthContext';
import moment from 'moment';


const CancellationsStats = (props) => {
    let { cancellations } = props;
    return (
        <AuthContext.Consumer>
            {(context) => (
                <>
                <h3>Cancelled Lectures</h3>
                    { cancellations.length === 0 &&
                        <h5>no cancellations in the system.</h5>
                    }
                    { cancellations.length !== 0 &&
                        <>
                            <Table className="table" id="lectures-table">
                                <thead>
                                    <tr>
                                        <th>Course</th>
                                        <th>dataStart</th>
                                        <th>dataFinish</th>
                                        <th>classC</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cancellations.map((c, id) =>
                                        <CancellationsStatsItem key={id} cancellation={c} />
                                    )}
                                </tbody>
                            </Table>
                        </>
                    }
                </>
            )}
        </AuthContext.Consumer>
    );

}

const CancellationsStatsItem = (props) => {
    let { cancellation } = props;

    return (
        <tr>
            <td>{cancellation.course}</td>
            <td>{moment(new Date(cancellation.dataStart)).format("YYYY-MM-DD HH:mm")}</td>
            <td>{moment(new Date(cancellation.dataFinish)).format("YYYY-MM-DD HH:mm")}</td>
            <td>{cancellation.classC}</td>
        </tr>
    );
}

export default CancellationsStats;