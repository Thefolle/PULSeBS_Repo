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
            studentscsv: undefined, students: [], teacherscsv: undefined, teachers: [], coursescsv: undefined, courses: [], enrollmcsv: undefined, enrollments: [], lecturescsv: undefined, lectures: [], classescsv: undefined, classes: [], schedulecsv: undefined, schedule: []
        };
        this.updateStudentsData = this.updateStudentsData.bind(this);
        this.updateTeachersData = this.updateTeachersData.bind(this);
        this.updateCoursesData = this.updateCoursesData.bind(this);
        this.updateEnrollmData = this.updateEnrollmData.bind(this);
        this.updateLecturesData = this.updateLecturesData.bind(this);
        this.updateClassesData = this.updateClassesData.bind(this);
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
        console.log(this.state.lectures);
        console.log(this.state.classes);
    }

    importCSV = (type) => {
        const { studentscsv, teacherscsv, coursescsv, enrollmcsv, lecturescsv, classescsv, schedulecsv } = this.state;

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

            case 'lectures':
                if( lecturescsv !== undefined ) {
                    Papa.parse(lecturescsv, {
                        complete: this.updateLecturesData,
                        header: true
                    });
                }

            case 'classes':
                if( classescsv !== undefined ) {
                    Papa.parse(classescsv, {
                        complete: this.updateClassesData,
                        header: true
                    });
                }

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
        var data = result.data.map(e => ({ id: e.Id, name: e.Name, surname: e.Surname, city: e.City, email: e.OfficialEmail, bday: e.Birthday, ssn: e.SSN, password: e.Password }));
        this.setState({ students: data });
    }

    updateTeachersData(result) {
        var data = result.data.map(e => ({ id: e.Id, name: e.Name, surname: e.Surname, email: e.OfficialEmail, password: e.Password }));
        this.setState({ teachers: data });
    }

    updateCoursesData(result) {
        var data = result.data.map(e => ({ id: e.Code, year: e.Year, semester: e.Semester, course: e.Desc, teacher: e.Teacher }));
        this.setState({ courses: data });
    }

    updateEnrollmData(result) {
        var data = result.data.map(e => ({ cid: e.Code, sid: e.Student }));
        this.setState({ enrollments: data });
    }

    updateLecturesData(result) {
        var data = result.data.map(e => ({ course: e.ref_course, ref_class: e.ref_class, start_date: e.start_date, end_date: e.end_date, presence: e.presence, bookable: e.bookable, active: e.active }));
        this.setState({ schedule: data });
    }

    updateClassesData(result) {
        var data = result.data.map(e => ({ id: e.Id, desc: e.Desc, seats: e.Seats }));
        this.setState({ classes: data });
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
                                                            <Form.File.Label>CLASSES:</Form.File.Label>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Form.File.Input
                                                                className="csv-input"
                                                                type="file"
                                                                ref={input => {
                                                                    this.filesInput = input;
                                                                }}
                                                                name="classescsv"
                                                                placeholder={null}
                                                                onChange={this.handleChange}
                                                            />
                                                        </Col>
                                                        <Col sm="2">
                                                            <Button variant="secondary" active="false" size="sm" style={{ height: "2rem", width: "4rem" }} onClick={(e) => { e.stopPropagation(); this.importCSV("classes") }}>import</Button>
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
                                                            <Form.File.Label column sm="3">LECTURES:</Form.File.Label>
                                                        </Col>
                                                        <Col sm="6">
                                                            <Form.File.Input
                                                                className="csv-input"
                                                                type="file"
                                                                ref={input => {
                                                                    this.filesInput = input;
                                                                }}
                                                                name="lecturescsv"
                                                                placeholder={null}
                                                                onChange={this.handleChange}
                                                            />
                                                        </Col>
                                                        <Col sm="2">
                                                            <Button variant="secondary" size="sm" style={{ height: "2rem", width: "4rem" }} onClick={(e) => { e.stopPropagation(); this.importCSV("lectures") }}>import</Button>
                                                        </Col>
                                                    </Form.File>
                                            </ListGroup.Item>
                                            {/* 
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
                                             */}

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
