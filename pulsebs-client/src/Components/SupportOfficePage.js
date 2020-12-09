import React from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Papa } from 'papaparse/papaparse/';
import UserNavBar from '../Components/UserNavBar';
import Form from 'react-bootstrap/Form'

import '../App.css';

import { Switch } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";

class SupportOfficePage extends React.Component {

    constructor() {
        super();
        this.state = {
            studentscsv: undefined, students: [], teacherscsv: undefined, teachers: [], coursescsv: undefined, courses: [], enrollmcsv: undefined, enrollments: [], schedulecsv: undefined, schedule: []
        };
        this.updateStudentsData = this.updateStudentsData.bind(this);
        this.updateTeachersData = this.updateTeachersData.bind(this);
        this.updateCoursesData = this.updateCoursesData.bind(this);
        this.updateEnrollmData = this.updateEnrollmData.bind(this);
        this.updateScheduleData = this.updateScheduleData.bind(this);
        this.sendData = this.sendData.bind(this);
    }

    handleChange = event => {
        console.log(event.target.files[0]);
        this.setState({
            [event.target.name]: event.target.files[0]
        });
    };

    sendData = () => {
        console.log(this.state.students);
        console.log(this.state.teachers);
        console.log(this.state.courses);
        console.log(this.state.enrollments);
        console.log(this.state.schedule);
    }

    importCSV = (type) => {
        const { studentscsv, teacherscsv, coursescsv, enrollmcsv, schedulecsv } = this.state;

        var Papa = require("papaparse/papaparse.min.js");

        console.log(type);

        switch (type) {
            case 'students':
                if (studentscsv !== undefined) {
                    Papa.parse(studentscsv, {
                        complete: this.updateStudentsData,
                        header: true
                    });
                }
                break;

            case 'teachers':
                if (teacherscsv !== undefined) {
                    Papa.parse(teacherscsv, {
                        complete: this.updateTeachersData,
                        header: true
                    });
                }
                break;

            case 'courses':
                if (coursescsv !== undefined) {
                    Papa.parse(coursescsv, {
                        complete: this.updateCoursesData,
                        header: true
                    });
                }
                break;

            case 'enrollments':
                if (enrollmcsv !== undefined) {
                    Papa.parse(enrollmcsv, {
                        complete: this.updateEnrollmData,
                        header: true
                    });
                }
                break;

            case 'schedule':
                if (schedulecsv !== undefined) {
                    Papa.parse(schedulecsv, {
                        complete: this.updateScheduleData,
                        header: true
                    });
                }
                break;

        }

    };

    updateStudentsData(result) {
        var data = result.data.map(e => ({ id: e.Id, name: e.Name, surname: e.Surname, city: e.City, email: e.OfficialEmail, bday: e.Birthday, ssn: e.SSN }));
        console.log(data);
        this.setState({ students: data });
    }

    updateTeachersData(result) {
        var data = result.data.map(e => ({ id: e.Number, name: e.GivenName, surname: e.Surname, email: e.OfficialEmail, ssn: e.SSN }));
        console.log(data);
        this.setState({ teachers: data });
    }

    updateCoursesData(result) {
        var data = result.data.map(e => ({ id: e.Code, year: e.Year, semester: e.Semester, course: e.Course }));
        console.log(data);
        this.setState({ courses: data });
    }

    updateEnrollmData(result) {
        var data = result.data.map(e => ({ cid: e.Code, sid: e.Student }));
        console.log(data);
        this.setState({ enrollments: data });
    }

    updateScheduleData(result) {
        var data = result.data.map(e => ({ id: e.Code, room: e.Room, date: e.Date, seats: e.Seats, time: e.Time }));
        console.log(data);
        this.setState({ schedule: data });
    }




    handleErrors = (err) => {
        if (err) {
            if (err.status && err.status === 401) {
                this.setState({ authErr: err });
                this.props.history.push("/");
            } else {
                //other errors that may happens and choose the page in which are displayed
                this.setState({ authErr: err });
            }
        }
        console.log("Error occured. Check the handleErrors method in studentPage.");
        console.log(err);
    }




    render() {

        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        {context.authUser && <>
                            <UserNavBar userId={context.authUser.id} />
                            <Container>
                                <Row>
                                    <Col sm={3} id="left-sidebar" className="collapse d-sm-block below-nav">
                                        <ListGroup className="sidebar" variant="flush">
                                            <h5>POLITECNICO DI TORINO</h5>
                                            <h3>SUPPORT OFFICE</h3>
                                        </ListGroup>
                                    </Col>

                                    <Col sm={8}>
                                        <br />
                                        <h4>Import CSV files to set up the system:</h4>
                                        <br />
                                        <ListGroup variant="flush">
                                            <ListGroup.Item>
                                                    <Form.File as={Row} >
                                                        <Col sm="4">
                                                            <Form.File.Label>STUDENTS:</Form.File.Label>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Form.File.Input
                                                                className="csv-input"
                                                                type="file"
                                                                ref={input => {
                                                                    this.filesInput = input;
                                                                }}
                                                                name="studentscsv"
                                                                placeholder={null}
                                                                onChange={this.handleChange}
                                                            />
                                                        </Col>
                                                        <Col sm="2">
                                                            <Button variant="secondary" size="sm" style={{ height: "2rem", width: "4rem" }} onClick={(e) => { e.stopPropagation(); this.importCSV("students"); }}>import</Button>
                                                        </Col>
                                                    </Form.File>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                    <Form.File as={Row} >
                                                        <Col sm="4">
                                                            <Form.File.Label>TEACHERS:</Form.File.Label>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Form.File.Input
                                                                className="csv-input"
                                                                type="file"
                                                                ref={input => {
                                                                    this.filesInput = input;
                                                                }}
                                                                name="teacherscsv"
                                                                placeholder={null}
                                                                onChange={this.handleChange}
                                                            />
                                                        </Col>
                                                        <Col sm="2">
                                                            <Button variant="secondary" active="false" size="sm" style={{ height: "2rem", width: "4rem" }} onClick={(e) => { e.stopPropagation(); this.importCSV("teachers") }}>import</Button>
                                                        </Col>
                                                    </Form.File>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                    <Form.File as={Row} >
                                                        <Col sm="4">
                                                            <Form.File.Label>COURSES:</Form.File.Label>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Form.File.Input
                                                                className="csv-input"
                                                                type="file"
                                                                ref={input => {
                                                                    this.filesInput = input;
                                                                }}
                                                                name="coursescsv"
                                                                placeholder={null}
                                                                onChange={this.handleChange}
                                                            />
                                                        </Col>
                                                        <Col sm="2">
                                                            <Button variant="secondary" size="sm" style={{ height: "2rem", width: "4rem" }} onClick={(e) => { e.stopPropagation(); this.importCSV("courses") }}>import</Button>
                                                        </Col>
                                                    </Form.File>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                    <Form.File as={Row} >
                                                        <Col sm="4">
                                                            <Form.File.Label>ENROLLMENTS:</Form.File.Label>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Form.File.Input
                                                                className="csv-input"
                                                                type="file"
                                                                ref={input => {
                                                                    this.filesInput = input;
                                                                }}
                                                                name="enrollmcsv"
                                                                placeholder={null}
                                                                onChange={this.handleChange}
                                                            />
                                                        </Col>
                                                        <Col sm="2">
                                                            <Button variant="secondary" size="sm" style={{ height: "2rem", width: "4rem" }} onClick={(e) => { e.stopPropagation(); this.importCSV("enrollments") }}>import</Button>
                                                        </Col>
                                                    </Form.File>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                    <Form.File as={Row} >
                                                        <Col sm="4">
                                                            <Form.File.Label column sm="3">SCHEDULE:</Form.File.Label>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Form.File.Input
                                                                className="csv-input"
                                                                type="file"
                                                                ref={input => {
                                                                    this.filesInput = input;
                                                                }}
                                                                name="schedulecsv"
                                                                placeholder={null}
                                                                onChange={this.handleChange}
                                                            />
                                                        </Col>
                                                        <Col sm="2">
                                                            <Button variant="secondary" size="sm" style={{ height: "2rem", width: "4rem" }} onClick={(e) => { e.stopPropagation(); this.importCSV("schedule") }}>import</Button>
                                                        </Col>
                                                    </Form.File>
                                            </ListGroup.Item>

                                        </ListGroup>
                                        <p />
                                        <button onClick={(e) => { e.stopPropagation(); this.sendData() }}> Upload now! </button>


                                    </Col>
                                </Row>
                            </Container>
                        </>
                        }
                    </>
                )}
            </AuthContext.Consumer>
        );
    }
}


export default withRouter(SupportOfficePage);
