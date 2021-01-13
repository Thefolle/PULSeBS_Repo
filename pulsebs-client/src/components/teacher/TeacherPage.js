import React from 'react';
import { Col, Container, Jumbotron, ListGroup, Row } from "react-bootstrap";
import { Route, Switch, withRouter } from 'react-router-dom';
import API from '../../API/API';
import { AuthContext } from '../../auth/AuthContext';
import '../../style/App.css';
import '../../style/customStyle.css';
import NavigationBar from '../NavigationBar';
import Tutorial from '../Tutorial';
import CourseList from './Courses';
import LectureList from './Lectures';
import Presence from "./Presence";
import Statistics from './Statistics';
import StudentList from './Students';


class TeacherPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: 'teacher',
            lectures: [],
            courses: [],
            students: []
        };

        this.turnLectureIntoOnline = this.turnLectureIntoOnline.bind(this);
    }



    // Update the front end instead of retreiving all lectures again, after
    // that a lecture has been turnt to be online (after the click)
    turnLectureIntoOnline = (lectureId, teacherId) => {
        API.turnLectureIntoOnline(lectureId, teacherId).then( () => {
            API.getTeacherLectures().then((lectures) => {
                this.setState({ lectures: lectures.sort(function (a, b) {
                                        return a.date - b.date || a.course - b.course ||  a.lecId - b.lecId;
                                    }) });
            });
        }).catch(error => {
            console.log(error);
        });
    }

    componentDidMount() {
        API.getTeacherLectures()
            .then((lectures) => {
                this.setState({
                    lectures: lectures.sort(function (a, b) {
                                        return a.date - b.date || a.course - b.course ||  a.lecId - b.lecId;
                                    })
                });
                this.getStudentsByLecture();
                this.getCourses(lectures);
            })
            .catch((err) => {
                this.handleErrors(err);
            });
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
        console.log("Error occured. Check the handleErrors method in teacherPage.");
        console.log(err);
    }

    getCourses = (lectures) => {
        const result = [];
        const map = new Map();
        for (const item of lectures) {
            if (!map.has(item.id)) {
                map.set(item.id, true);    // set any value to Map
                result.push({
                    id: item.id,
                    course: item.course
                });
            }
        }
        result.sort();
        this.setState({ courses: result });
    }


    getStudentsByLecture = () => {
        API.getStudents()
            .then((student) => {
                this.setState({ students: student });
            })
            .catch((err) => {
                this.handleErrors(err);
            });
    }

    getTeacherLectures = () => {
        API.getTeacherLectures()
            .then((lectures) => {
                this.setState({ lectures: lectures.sort(function (a, b) {
                                        return a.date - b.date || a.course - b.course ||  a.lecId - b.lecId;
                                    }) });
                this.getCourses(lectures);
                this.getStudentsByLecture();
            })
            .catch((errorObj) => {
                this.handleErrors(errorObj);
            });
    }

    cancelLecture = (teacherId, lectureId) => {
        API.cancelLecture(teacherId, lectureId)
            .then(() => {
                //get the updated list of tasks from the server
                API.getTeacherLectures().then((lectures) => this.setState({ lectures: lectures.sort(function (a, b) {
                                        return a.date - b.date || a.course - b.course ||  a.lecId - b.lecId;
                                    }) }))
                    .catch((err) => {
                        this.handleErrors(err);
                    });
            })
            .catch((errorObj) => {
                this.handleErrors(errorObj);
            });
    }


    render() {

        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        {context.authUser && <>
                            <NavigationBar userId={context.authUser.id} />
                            <Container>
                                <Row className={"justify-content-between"}>
                                    <Col sm={3} id="left-sidebar" className="collapse d-sm-block below-nav">
                                        <ListGroup className="sidebar" variant="flush" >
                                            <ListGroup.Item className="listGroup-Item">POLITECNICO DI TORINO</ListGroup.Item>
                                            <ListGroup.Item className="listGroup-Item"> {context.authUser.name}</ListGroup.Item>
                                            <ListGroup.Item className="listGroup-Item"> {context.authUser.surname}</ListGroup.Item>
                                            <Tutorial on={true} text='This is your identification number.' push={
                                                context.authUser.id
                                            } />
                                        </ListGroup>
                                    </Col>
                                    <Col sm={9}>
                                        <Switch>
                                            <Route exact path={"/teacher/courses"}>
                                                <CourseList courses={this.state.courses} />
                                            </Route>
                                            <Route exact path={"/teacher/:courseId/lectures"} render={({ match }) => (
                                                <LectureList lectures={this.state.lectures} idc={match.params.courseId} cancelLecture={this.cancelLecture} turnLectureIntoOnline={this.turnLectureIntoOnline} />
                                            )} />
                                            <Route exact path={"/teacher/:courseId/lecture/:lectureId/presence"} render={({ match }) => (
                                                <Presence
                                                              course={ this.state.courses.find( course => course.id === parseInt(match.params.courseId)) }
                                                              lecture={ this.state.lectures.find( lecture => lecture.lecId === parseInt(match.params.lectureId)) }
                                                />
                                        )} />
                                            <Route exact path={"/teacher/:courseId/lectures/:lectureId/students"} render={({ match }) => (
                                                <StudentList students={this.state.students} idl={match.params.lectureId} idc={match.params.courseId} />
                                            )} />
                                            <Route path={"/teacher/:teacherId/statistics"} render={() => {
                                                if (!this.state.courses || this.state.courses.length === 0) {
                                                    return <Jumbotron className='error'><p>It seems that you don't have taught at any course.</p><p>Please, refresh the page or contact the segretary for information.</p></Jumbotron>;
                                                } else {
                                                    return <Statistics courses={this.state.courses} userId={context.authUser.id} />
                                                }
                                            }
                                            } />
                                        </Switch>
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

export default withRouter(TeacherPage);
