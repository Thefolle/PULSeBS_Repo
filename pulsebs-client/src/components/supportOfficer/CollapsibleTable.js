import PropTypes from 'prop-types';
import React from 'react';
import { Accordion, Button, Card, Table } from "react-bootstrap";

class CollapsibleTable extends React.Component {

     produceHeader = () => {
         if( this.props.tableHeader.length === 0)
             return "No data to be shown"
        let header = []
        this.props.tableHeader.forEach( ( column ) => {
            header.push( <th>{ column }</th> );
        } )
        return header;
    }

     produceData = () => {
         if( this.props.tableData.length === 0)
             return "No data to be shown"
        let content = []
         this.props.tableData.forEach( ( data ) => {
            let entry = [];
            for(const value in data) entry.push( <td>{ data[value] }</td> );
            content.push( <tr>{ entry }</tr> );
        } )
        return content;
    }

    render() {
        return <Accordion>
            <Card style={{width: "900px"}}>
                <Card.Header>
                    <Accordion.Toggle as={ Button } variant="link" eventKey="0">
                        { this.props.tableName }
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <Table striped bordered hover responsive size={"sm"}>
                            <thead>
                            <tr>
                                { this.produceHeader() }
                            </tr>
                            </thead>
                            <tbody>
                            { this.produceData() }
                            </tbody>
                        </Table>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    };

}

CollapsibleTable.propTypes = {
    tableData: PropTypes.array.isRequired,
    tableHeader: PropTypes.array.isRequired,
    tableName: PropTypes.string.isRequired
}

export default CollapsibleTable;