import moment from "moment";
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import API from "../../API/API.js";
import Tutorial from '../Tutorial';


class Presence extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            students: [],
            presences: new Map()
        }
    }

    componentDidMount() {
        API.getStudentForLecture(this.props.course.id, this.props.lecture.lecId)
            .then(studentsList => {
                console.log(studentsList);
                let presences = new Map();
                studentsList.forEach(student => {
                    presences.set(student.id, student.presence === 1);
                })
                this.setState({ students: studentsList, presences: presences });
            })
            .catch(error => {
                console.log(error);
                this.setState({ students: [] });
            })
    }

    mapToJson = (map) => {
        let res = [];
        for (let entry of map) {
            let obj = {};
            obj["id"] = entry[0];
            obj["presence"] = entry[1];
            res.push(obj)
        }
        return res;
    }

    handleSubmit = (event) => {
        let studentIds = this.mapToJson(this.state.presences);
        API.setStudentPresencesForLecture(this.props.course.id, this.props.lecture.lecId, studentIds)
            .then(res => this.setState({
                students: [],
                presences: new Map()
            }, () => {
                window.alert("Presences setted correctly!");
                this.props.history.replace(`/teacher/${this.props.course.id}/lectures`);
            }))
            .catch(res => console.log(res));
        event.preventDefault();
    }

    handleChange = (id) => {
        console.log(id);
        let presences = this.state.presences;
        let value = this.state.presences.get(id);
        presences.set(id, !value);
        this.setState({ presences: presences });
    }

    render() {
        let tableContent = [];
        if (this.state.students.length > 0) {
            this.state.students.forEach(student => tableContent.push(<tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.surname}</td>
                <td>{student.email}</td>
                <td>
                    <Tutorial on={true} text={<p>Was this student present in the lecture?
                        <ul>
                            <li>If yes, check it here;</li>
                            <li>If no, don't check it.</li>
                        </ul>
                    </p>} push={
                        <Form.Check
                            type={'checkbox'}
                            value={this.state.presences.get(student.id)}
                            checked={this.state.presences.get(student.id)}
                            name={student.id}
                            onChange={(event) => this.handleChange(parseInt(event.target.name))}
                        />
                    } />

                </td>
            </tr>))
        } else {
            tableContent = <tr>
                <td colSpan={5}>No students booked for this lecture</td>
            </tr>
        }
        return <>
            <br />
            <h3>Presence for lecture of {this.props.course.course}
                <br />
                {moment(this.props.lecture.date).format("YYYY-MM-DD HH:mm")} / {moment(this.props.lecture.endTime).format("YYYY-MM-DD HH:mm")}
            </h3>
            <Form onSubmit={this.handleSubmit}>
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
                        {tableContent}
                    </tbody>
                </Table>
                <Row style={{justifyContent: 'center'}}>
                    <Col xs={4}>
                        <Tutorial on={true} text='If you have finished to do the roll call, click here and the presences will be registered.' push={
                            <Button type="submit">
                                Confirm presence
                            </Button>
                        } />
                    </Col>
                </Row>
            </Form>
        </>
    }

}

Presence
    .propTypes = {
    lecture: PropTypes.object.isRequired,
    course: PropTypes.object.isRequired
}

export default withRouter(Presence);