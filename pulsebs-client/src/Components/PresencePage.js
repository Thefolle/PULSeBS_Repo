import React     from 'react';
import PropTypes from 'prop-types';
import { Table } from "react-bootstrap";


class PresencePage extends React.Component {

    render() {
        return <>
            <br/>
            <h3>Presence for lecture of COURSE - START / END</h3>
            <Table responsive>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Presence</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    { Array.from( {length: 3} ).map( ( _, index ) => (
                        <td key={ index }>Table cell { index }</td>
                    ) ) }
                </tr>
                </tbody>
            </Table>
        </>
    }

}

PresencePage.propTypes = {
    lectureId: PropTypes.number.isRequired
}

export default PresencePage;