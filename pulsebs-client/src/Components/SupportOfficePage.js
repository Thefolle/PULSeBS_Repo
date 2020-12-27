import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import UserNavBar from '../Components/UserNavBar';
import Form from 'react-bootstrap/Form';

import '../App.css';
import API from '../API/API';
import { AuthContext } from '../auth/AuthContext';
import { Row, Col, Container, ListGroup, Button, FormGroup, FormLabel, Accordion, Card } from "react-bootstrap";
import CollapsibleTable from "./CollapsibleTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Lecture from '../API/Lecture';
import scheduledLecture from '../API/scheduledLecture'

let buttonsStyle = {
    background: "blue",
    height: "2rem",
    width: "4rem"
};

let selectedButtonStyle = {
    background: "green",
    height: "2rem",
    width: "4rem"
};

class SupportOfficePage extends React.Component {

    constructor() {
        super();
        this.state = {
            studentscsv: undefined,
            students: [],
            teacherscsv: undefined,
            teachers: [],
            coursescsv: undefined,
            courses: [],
            enrollmentscsv: undefined,
            enrollments: [],
            lecturescsv: undefined,
            lectures: [],
            classescsv: undefined,
            classes: [],
            shortStartDate: new Date().toDateString(),
            startDate: '',
            shortEndDate: new Date().toDateString(),
            endDate: '',
            schedulecsv: undefined,
            schedule: [],
            studentsImported: [[]],
            teachersImported: [[]],
            coursesImported: [[]],
            enrollmentsImported: [[]],
            lecturesImported: [[]],
            classesImported: [[]],
            scheduleImported: [[]],
            failed: ''
        };
        this.updateStudentsData = this.updateStudentsData.bind(this);
        this.updateTeachersData = this.updateTeachersData.bind(this);
        this.updateCoursesData = this.updateCoursesData.bind(this);
        this.updateEnrollmData = this.updateEnrollmData.bind(this);
        this.updateLecturesData = this.updateLecturesData.bind(this);
        this.updateClassesData = this.updateClassesData.bind(this);
        this.updateScheduleData = this.updateScheduleData.bind(this);
        this.sendData = this.sendData.bind(this);
        this.handleStartDate = this.handleStartDate.bind(this);
        this.handleEndDate = this.handleEndDate.bind(this);
        this.sendNewSchedule = this.sendNewSchedule.bind(this);
    }

    handleChange = event => {
        let fileName = event.target.name + "csv";
        this.setState({
            [event.target.name]: [], [fileName]: event.target.files[0], failed: ''
        });
    };

    handleStartDate(value) {
        this.setState({
            shortStartDate: value.toDateString(), startDate: value
        });
    };

    handleEndDate(value) {
        this.setState({
            shortEndDate: value.toDateString(), endDate: value
        });
    };

    sendData = () => {
        const { students, teachers, courses, enrollments, classes, lectures } = this.state;

        API.importCSV(students, teachers, courses, enrollments, classes, lectures).then((result) => {
            if (result.ok) {
                console.log(students);
                //get the updated list of tasks from the server
                this.setState({
                    failed: 0,
                    studentscsv: undefined,
                    teacherscsv: undefined,
                    coursescsv: undefined,
                    enrollmentscsv: undefined,
                    lecturescsv: undefined,
                    classescsv: undefined,
                    schedulecsv: undefined,
                    studentsImported: students,
                    teachersImported: teachers,
                    coursesImported: courses,
                    enrollmentsImported: enrollments,
                    lecturesImported: lectures,
                    classesImported: classes,
                });
            } else {
                this.setState({
                    failed: 1,
                    studentscsv: undefined,
                    students: [],
                    teacherscsv: undefined,
                    teachers: [],
                    coursescsv: undefined,
                    courses: [],
                    enrollmentscsv: undefined,
                    enrollments: [],
                    lecturescsv: undefined,
                    lectures: [],
                    classescsv: undefined,
                    classes: [],
                    schedulecsv: undefined,
                    schedule: [],
                    studentsImported: [[]],
                    teachersImported: [[]],
                    coursesImported: [[]],
                    enrollmentsImported: [[]],
                    lecturesImported: [[]],
                    classesImported: [[]],
                    scheduleImported: [[]],
                });
            }
        }) //if SUCCEDED return 1
            .catch((errorObj) => {
                this.handleErrors(errorObj);
                this.setState({
                    failed: 1,
                    studentscsv: undefined,
                    students: [],
                    teacherscsv: undefined,
                    teachers: [],
                    coursescsv: undefined,
                    courses: [],
                    enrollmentscsv: undefined,
                    enrollments: [],
                    lecturescsv: undefined,
                    lectures: [],
                    classescsv: undefined,
                    classes: [],
                    schedulecsv: undefined,
                    schedule: [],
                    studentsImported: [[]],
                    teachersImported: [[]],
                    coursesImported: [[]],
                    enrollmentsImported: [[]],
                    lecturesImported: [[]],
                    classesImported: [[]],
                    scheduleImported: [[]],
                });
            });
    }

    sendNewSchedule = () => {
        const { schedule, startDate, endDate } = this.state;
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

        let newLectures = [];
    
       for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
           let day = days[d.getDay()];
           let filteredLectures = schedule.filter((s) => s.day === day);

           for(let i=0; i<filteredLectures.length; i++){
            let s = filteredLectures[i];
            let start = new Date(d);
            let end = new Date(d);
            start.setHours(s.startTime.split(":")[0], s.startTime.split(":")[1], 0, 0);
            end.setHours(s.endTime.split(":")[0], s.endTime.split(":")[1], 0, 0);

            let startUnix = moment(start).unix();
            let endUnix = moment(end).unix();

            let lecture = new scheduledLecture(s.course, s.class, startUnix, endUnix, s.presence, s.bookable, s.active);
            newLectures.push(lecture);
        }
    }
       console.log(newLectures); 

    }

    importCSV = (type) => {
        const { studentscsv, teacherscsv, coursescsv, enrollmentscsv, lecturescsv, classescsv, schedulecsv } = this.state;

        var Papa = require("papaparse/papaparse.min.js");

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
                if (enrollmentscsv !== undefined) {
                    Papa.parse(enrollmentscsv, {
                        complete: this.updateEnrollmData,
                        header: true
                    });
                }
                break;

            case 'lectures':
                if (lecturescsv !== undefined) {
                    Papa.parse(lecturescsv, {
                        complete: this.updateLecturesData,
                        header: true
                    });
                }
                break;

            case 'classes':
                if (classescsv !== undefined) {
                    Papa.parse(classescsv, {
                        complete: this.updateClassesData,
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

            default:
                break;

        }

    };


    updateStudentsData(result) {
        var data = result.data.map(e => ({
            id: e.Id,
            name: e.Name,
            surname: e.Surname,
            city: e.City,
            email: e.Email,
            bday: e.Birthday,
            ssn: e.SSN,
            password: e.Password
        }));
        this.setState({ students: data.slice(0, 15) });
    }

    updateTeachersData(result) {
        var data = result.data.map(e => ({
            id: e.Id,
            name: e.Name,
            surname: e.Surname,
            email: e.Email,
            password: e.Password
        }));
        this.setState({ teachers: data.slice(0, 10) });
    }

    updateCoursesData(result) {
        var data = result.data.map(e => ({
            id: e.Id,
            year: e.Year,
            semester: e.Semester,
            course: e.Desc,
            teacher: e.Teacher
        }));
        this.setState({ courses: data.slice(0, data.length) });
    }

    updateEnrollmData(result) {
        var data = result.data.map(e => ({ cid: e.Code, sid: e.Student }));
        this.setState({ enrollments: data.slice(0, data.length) });
    }

    updateLecturesData(result) {
        var data = result.data.map(e => ({
            course: e.ref_course,
            ref_class: e.ref_class,
            start_date: e.start_date,
            end_date: e.end_date,
            presence: e.presence,
            bookable: e.bookable,
            active: e.active
        }));
        this.setState({ lectures: data.slice(0, 30) });
    }

    updateClassesData(result) {
        var data = result.data.map(e => ({ id: e.Id, desc: e.Desc, seats: e.Seats }));
        this.setState({ classes: data.slice(0, 30) });
    }

    updateScheduleData(result) {
        var data = result.data.map(e => ({ course: e.course, class: e.class, day: e.day, startTime: e.startTime, endTime: e.endTime, presence: e.presence, bookable: e.bookable, active: e.active }));
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
                this.setState({
                    failed: 1,
                    studentscsv: undefined,
                    students: [],
                    teacherscsv: undefined,
                    teachers: [],
                    coursescsv: undefined,
                    courses: [],
                    enrollmentscsv: undefined,
                    enrollments: [],
                    lecturescsv: undefined,
                    lectures: [],
                    classescsv: undefined,
                    classes: [],
                    schedulecsv: undefined,
                    schedule: []
                });
            }
        }
        console.log("Error occured. Check the handleErrors method in supportOfficerPage.");
        console.log(err);
        this.setState({
            failed: 1,
            studentscsv: undefined,
            students: [],
            teacherscsv: undefined,
            teachers: [],
            coursescsv: undefined,
            courses: [],
            enrollmentscsv: undefined,
            enrollments: [],
            lecturescsv: undefined,
            lectures: [],
            classescsv: undefined,
            classes: [],
            schedulecsv: undefined,
            schedule: []
        });
    }

    restoreFunction = () => {
        console.log("Restored!");
        this.setState({
            failed: '',
            studentscsv: undefined,
            students: [],
            teacherscsv: undefined,
            teachers: [],
            coursescsv: undefined,
            courses: [],
            enrollmentscsv: undefined,
            enrollments: [],
            lecturescsv: undefined,
            lectures: [],
            classescsv: undefined,
            classes: [],
            schedulecsv: undefined,
            schedule: []
        });
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

                                    <Col sm={8} hidden={this.state.failed === 0}>
                                        <br />
                                        <h4>Import CSV files to set up the system:</h4>
                                        <br />
                                        {this.state.failed === 1 &&
                                            <p>Something went wrong. Please, select and import again your files.</p>
                                        }
                                        {this.state.failed === 0 &&
                                            <p>Upload completed.</p>
                                        }
                                        {this.state.failed === '' &&
                                            <p>Please, SELECT and IMPORT your files and then UPLOAD them.</p>
                                        }
                                        <ListGroup variant="flush">
                                            <ListGroup.Item>
                                                <Form.File as={Row}>
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
                                                            name="students"
                                                            placeholder={null}
                                                            onChange={this.handleChange}
                                                            onClick={(e) => e.target.value = null}
                                                        />
                                                    </Col>
                                                    <Col sm="2">
                                                        {this.state.students.length === 0 ?
                                                            <Button variant="secondary" active="false" size="sm"
                                                                style={buttonsStyle} onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.importCSV("students")
                                                                }}>import</Button>
                                                            : <Button variant="secondary" active="false" size="sm"
                                                                style={selectedButtonStyle} onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.importCSV("students")
                                                                }}>import</Button>
                                                        }
                                                    </Col>
                                                </Form.File>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Form.File as={Row}>
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
                                                            name="teachers"
                                                            placeholder={null}
                                                            onChange={this.handleChange}
                                                            onClick={(e) => e.target.value = null}
                                                        />
                                                    </Col>
                                                    <Col sm="2">
                                                        {this.state.teachers.length === 0 ?
                                                            <Button variant="secondary" active="false" size="sm"
                                                                style={buttonsStyle} onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.importCSV("teachers")
                                                                }}>import</Button>
                                                            : <Button variant="secondary" active="false" size="sm"
                                                                style={selectedButtonStyle} onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.importCSV("teachers")
                                                                }}>import</Button>
                                                        }
                                                    </Col>
                                                </Form.File>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Form.File as={Row}>
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
                                                            name="courses"
                                                            placeholder={null}
                                                            onChange={this.handleChange}
                                                            onClick={(e) => e.target.value = null}
                                                        />
                                                    </Col>
                                                    <Col sm="2"> {this.state.courses.length === 0 ?
                                                        <Button variant="secondary" active="false" size="sm"
                                                            style={buttonsStyle} onClick={(e) => {
                                                                e.stopPropagation();
                                                                this.importCSV("courses")
                                                            }}>import</Button>
                                                        : <Button variant="secondary" active="false" size="sm"
                                                            style={selectedButtonStyle} onClick={(e) => {
                                                                e.stopPropagation();
                                                                this.importCSV("courses")
                                                            }}>import</Button>
                                                    }
                                                    </Col>
                                                </Form.File>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Form.File as={Row}>
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
                                                            name="classes"
                                                            placeholder={null}
                                                            onChange={this.handleChange}
                                                            onClick={(e) => e.target.value = null}
                                                        />
                                                    </Col>
                                                    <Col sm="2">
                                                        {this.state.classes.length === 0 ?
                                                            <Button variant="secondary" active="false" size="sm"
                                                                style={buttonsStyle} onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.importCSV("classes")
                                                                }}>import</Button>
                                                            : <Button variant="secondary" active="false" size="sm"
                                                                style={selectedButtonStyle} onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.importCSV("classes")
                                                                }}>import</Button>
                                                        }
                                                    </Col>
                                                </Form.File>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Form.File as={Row}>
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
                                                            name="enrollments"
                                                            placeholder={null}
                                                            onChange={this.handleChange}
                                                            onClick={(e) => e.target.value = null}
                                                        />
                                                    </Col>
                                                    <Col sm="2">
                                                        {this.state.enrollments.length === 0 ?
                                                            <Button variant="secondary" active="false" size="sm"
                                                                style={buttonsStyle} onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.importCSV("enrollments")
                                                                }}>import</Button>
                                                            : <Button variant="secondary" active="false" size="sm"
                                                                style={selectedButtonStyle} onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.importCSV("enrollments")
                                                                }}>import</Button>
                                                        }
                                                    </Col>
                                                </Form.File>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Form.File as={Row}>
                                                    <Col sm="4">
                                                        <Form.File.Label>LECTURES:</Form.File.Label>
                                                    </Col>
                                                    <Col sm="6">
                                                        <Form.File.Input
                                                            className="csv-input"
                                                            type="file"
                                                            ref={input => {
                                                                this.filesInput = input;
                                                            }}
                                                            name="lectures"
                                                            placeholder={null}
                                                            onChange={this.handleChange}
                                                            onClick={(e) => e.target.value = null}
                                                        />
                                                    </Col>
                                                    <Col sm="2"> {this.state.lectures.length === 0 ?
                                                        <Button variant="secondary" active="false" size="sm"
                                                            style={buttonsStyle} onClick={(e) => {
                                                                e.stopPropagation();
                                                                this.importCSV("lectures")
                                                            }}>import</Button>
                                                        : <Button variant="secondary" active="false" size="sm"
                                                            style={selectedButtonStyle} onClick={(e) => {
                                                                e.stopPropagation();
                                                                this.importCSV("lectures")
                                                            }}>import</Button>
                                                    }
                                                    </Col>
                                                </Form.File>
                                            </ListGroup.Item>
                                        </ListGroup>
                                        <p />
                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            this.sendData()
                                        }}> Upload now!
                                        </button>
                                        <br />
                                        <br />
                                        <br />

                                        <h4>Schedule</h4>
                                        <br />
                                        <Row>
                                            <Col sm={4}>
                                                <Row>
                                                    <FormGroup>
                                                        <FormLabel>from:</FormLabel>
                                                        <DatePicker
                                                            id="datepicker-start"
                                                            name="startDate"
                                                            value={this.state.shortStartDate}
                                                            onChange={this.handleStartDate}
                                                        />
                                                    </FormGroup>
                                                </Row>
                                                <Row>
                                                    <FormGroup>
                                                        <FormLabel>to:</FormLabel>
                                                        <DatePicker
                                                            id="datepicker-end"
                                                            name="endDate"
                                                            value={this.state.shortEndDate}
                                                            onChange={this.handleEndDate}
                                                        />
                                                    </FormGroup>
                                                </Row>
                                            </Col>
                                            <Col sm={5}>

                                                <Form.File.Input
                                                    className="csv-input"
                                                    type="file"
                                                    ref={input => {
                                                        this.filesInput = input;
                                                    }}
                                                    name="schedule"
                                                    placeholder={null}
                                                    onChange={this.handleChange}
                                                    onClick={(e) => e.target.value = null}
                                                />

                                            </Col>
                                            <Col sm={3}>

                                                {this.state.schedule.length === 0 ?
                                                    <Button variant="secondary" active="false" size="sm" style={buttonsStyle} onClick={(e) => { e.stopPropagation(); this.importCSV("schedule") }}>import</Button>
                                                    : <Button variant="secondary" active="false" size="sm" style={selectedButtonStyle} onClick={(e) => { e.stopPropagation(); this.importCSV("schedule") }}>import</Button>
                                                }

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm={4}></Col>
                                            <Col sm={4}>
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                this.sendNewSchedule()
                                            }}> Upload now!
                                            </button>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col sm={8} hidden={this.state.failed || this.state.failed === ''}>
                                        <br />
                                        <h4>Here is what you uploaded!</h4>
                                        <Button as={"Link"} onClick={() => this.restoreFunction()}>Click here to go back!</Button>
                                        <br />
                                        <CollapsibleTable tableName={"Lectures"}
                                            tableHeader={["ref_course", "ref_class", "start_date",
                                                "end_date", "presence", "bookable", "active"]}
                                            tableData={this.state.lecturesImported} />
                                        <CollapsibleTable tableName={"Student"}
                                            tableHeader={["id", "name", "surname",
                                                "city", "email", "birthday", "SSN", "password"]}
                                            tableData={this.state.studentsImported} />
                                        <CollapsibleTable tableName={"Classes"}
                                            tableHeader={["id", "desc", "seats"]}
                                            tableData={this.state.classesImported} />
                                        <CollapsibleTable tableName={"Enrollment"}
                                            tableHeader={["code", "student"]}
                                            tableData={this.state.enrollmentsImported} />
                                        <CollapsibleTable tableName={"Courses"}
                                            tableHeader={["id", "year", "semester",
                                                "desc", "teacher"]}
                                            tableData={this.state.coursesImported} />
                                        <CollapsibleTable tableName={"Teachers"}
                                            tableHeader={["id", "name", "surname",
                                                "email", "password"]}
                                            tableData={this.state.teachersImported} />

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

/*
* <CollapsibleTable tableName={"Teacher"} tableData={this.state.teachers} />
                                        <CollapsibleTable tableName={"Classes"} tableData={this.state.classes} />
                                        <CollapsibleTable tableName={"Enrollment"} tableData={this.state.enrollments} />
                                        <CollapsibleTable tableName={"Lectures"} tableData={this.state.lectures} />
                                        <CollapsibleTable tableName={"Courses"} tableData={this.state.courses} />*/

export default withRouter(SupportOfficePage);
