import React                        from 'react';
import PropTypes                    from 'prop-types';
import { Table, Form, Row, Button } from "react-bootstrap";
import API                          from "../API/API.js";
import moment                       from "moment";


class PresencePage extends React.Component {

    constructor( props ) {
        super( props );
        this.state = {
            students: [],
            presences: new Map()
        }
    }

    componentDidMount() {
        API.getStudentForLecture( this.props.course.id, this.props.lecture.lecId )
           .then( studentsList => {
               console.log( studentsList );
               let presences = new Map();
               studentsList.forEach( student => {
                   presences.set( student.id, 0 );
               } )
               this.setState( {students: studentsList, presences: presences} );
           } )
           .catch( error => {
               console.log( error );
               this.setState( {students: []} );
           } )
    }

    mapToJson = ( map ) => {
        let res = [];
        for ( let entry of map ) res.push( entry[0] )
        return res;
    }

    handleSubmit = ( event ) => {
        let str = this.mapToJson( this.state.presences );
        console.log( JSON.stringify( str ) );
        event.preventDefault();
    }

    handleChange = ( id, value ) => {
        console.log( id + "-" + value );
        let presences = this.state.presences;
        presences.set( id, 1 );
        this.setState( {presences: presences} );
    }

    render() {
        let tableContent = [];
        if ( this.state.students.length > 0 ) {
            this.state.students.forEach( student => tableContent.push( <tr key={ student.id }>
                <td>{ student.id }</td>
                <td>{ student.name }</td>
                <td>{ student.surname }</td>
                <td>{ student.email }</td>
                <td><Form.Check
                    type={ 'checkbox' }
                    value={ this.state.presences.get( student.id ) }
                    name={ student.id }
                    onChange={ ( event ) => this.handleChange( parseInt( event.target.name ), event.target.value ) }
                /></td>
            </tr> ) )
        } else {
            tableContent = <tr>
                <td colSpan={ 5 }>No students booked for this lecture</td>
            </tr>
        }
        return <>
            <br/>
            <h3>Presence for lecture of { this.props.course.course }
                <br/>
                { moment( this.props.lecture.date ).format( "YYYY-MM-DD HH:mm" ) } / { moment( this.props.lecture.endDate ).format( "YYYY-MM-DD HH:mm" ) }
            </h3>
            <Form onSubmit={ this.handleSubmit }>
                <Table responsive>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th>Presence</th>
                    </tr>
                    </thead>
                    <tbody>
                    { tableContent }
                    </tbody>
                </Table>
                <div className={ "align-middle" }>
                    <Button type="submit">Confirm presence</Button>
                </div>
            </Form>
        </>
    }

}

PresencePage
    .propTypes = {
    lecture: PropTypes.object.isRequired,
    course: PropTypes.object.isRequired
}

export default PresencePage;