import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import API from '../API/API';
import CourseList from './CourseList';
import LectureList from './LectureList';
import StudentList from './StudentiList';
import ButtonTeacherHub from './ButtonTeacherHub';
import UserNavBar from './UserNavBar';
import { Link } from 'react-router-dom';


import { Button, Row, Col, Container, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaBackward } from "react-icons/fa";

import '../App.css';
import '../customStyle.css';

class TeacherPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id, //should be this.props.user.id
            email: '',
            name: this.props.name,
            surname: this.props.surname,
            userType: 'teacher',
            lectures: [],
            courses: [],
            students: []
        };

        this.goBack = this.goBack.bind(this); 
    }
    
    goBack(){
        this.props.history.goBack();
    }

    componentDidMount() {
        API.getTeacherLectures()
            .then((lectures) => {
                this.setState({
                    lectures: lectures,
                    courses: this.getCourses(lectures).sort()
                });
                this.getStudentsByLecture();
            })
            .catch((err) => {
                this.handleErrors(err);
            });
    }

    handleErrors = (err) => {
        if (err) {
            if (err.status && err.status === 401) {
                this.props.history.push("/");
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
        console.log("Courses:");
        console.log(result);
        return result;
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
                this.setState({ lectures: lectures, courses: this.getCourses(lectures).sort() });
                this.getStudentsByLecture();
            })
            .catch((errorObj) => {
                this.handleErrors(errorObj);
            });
    }

    render() {

        return (
            <>
                <UserNavBar userId={this.state.id} />
                <Container>
                    <Row>
                        <Col sm={3} id="left-sidebar" className="collapse d-sm-block below-nav">
                            <ListGroup className="sidebar" variant="flush" >
                                <h5>POLITECNICO DI TORINO</h5>
                                <ListGroup.Item className="listGroup-Item">name: {this.state.name}</ListGroup.Item>
                                <ListGroup.Item className="listGroup-Item">surname: {this.state.surname}</ListGroup.Item>
                                <ListGroup.Item className="listGroup-Item">id: {this.state.id}</ListGroup.Item>
                            </ListGroup>
                        </Col>

                        <Col sm={6}>
                        <Button id="goback" onClick={this.goBack}> <FaBackward /> </Button>
                        <Switch>
                            <Route exact path={"/teacher/courses"}>
                                <CourseList courses={this.state.courses}/>
                            </Route>
                            <Route exact path={"/teacher/:courseId/lectures"} render={({ match }) => (
                                <LectureList lectures={this.state.lectures} idc={match.params.courseId} getLectures={this.getTeacherLectures} />
                            )} />
                            <Route exact path={"/teacher/:courseId/lectures/:lectureId/students"} render={({ match }) => (
                                <StudentList students={this.state.students} idl={match.params.lectureId} getLectures={this.getTeacherLectures} />
                            )} />
                        </Switch>

                        </Col>
                      </Row>
                </Container>
            </>

        );
    }
}

export default withRouter(TeacherPage);
