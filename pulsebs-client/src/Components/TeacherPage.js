import React from 'react';
import { withRouter, Switch, Route} from 'react-router-dom';

import API from '../API/API';
import CourseList from './CourseList';
import LectureList from './LectureList';
import StudentList from './StudentiList';
import UserNavBar from './UserNavBar';
import {AuthContext} from '../auth/AuthContext';


import { Button, Row, Col, Container, ListGroup } from "react-bootstrap";
import { FaBackward } from "react-icons/fa";

import '../App.css';
import '../customStyle.css';

class TeacherPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: 'teacher',
            lectures: [],
            courses: [],
            students: []
        };

        this.goBack = this.goBack.bind(this);
    }

    goBack=()=>{
        this.props.history.goBack();
    }

    componentDidMount() {
      API.getTeacherLectures()
          .then((lectures) => {
              this.setState({
                  lectures: lectures
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
            }else{
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

        this.setState({courses:result.sort()});
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
              this.setState({ lectures: lectures });
              this.getCourses(lectures);
              this.getStudentsByLecture();
          })
          .catch((errorObj) => {
              this.handleErrors(errorObj);
          });
    }

    cancelLecture = (lectureId) => {
        API.cancelLecture(lectureId)
        .then(() => {
            //get the updated list of tasks from the server
            API.getTeacherLectures().then((lectures) => this.setState({ lectures : lectures }));
          })
          .catch((errorObj) => {
            this.handleErrors(errorObj);
          });
      }
      
    

    render() {

        return (
            <AuthContext.Consumer>
                {(context)=>(
                    <>
                   {context.authUser && <>
                   <UserNavBar userId={context.authUser.id} />
                    <Container>
                    <Row>
                        <Col sm={3} id="left-sidebar" className="collapse d-sm-block below-nav">
                            <ListGroup className="sidebar" variant="flush" >
                                <h5>POLITECNICO DI TORINO</h5>
                                <ListGroup.Item className="listGroup-Item"> {context.authUser.name}</ListGroup.Item>
                                <ListGroup.Item className="listGroup-Item"> {context.authUser.surname}</ListGroup.Item>
                                <ListGroup.Item className="listGroup-Item"> {context.authUser.id}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col sm={8}>
                        <Button id="goback" onClick={this.goBack}> <FaBackward /> </Button>
                        <Switch>
                        <Route exact path={"/teacher/courses"}>
                            <CourseList courses={this.state.courses} />
                        </Route>
                        <Route exact path={"/teacher/:courseId/lectures"} render={({ match }) => (
                            <LectureList lectures={this.state.lectures} idc={match.params.courseId} cancelLecture={this.cancelLecture}  />
                        )} />
                        <Route exact path={"/teacher/:courseId/lectures/:lectureId/students"} render={({ match }) => (
                            <StudentList students={this.state.students} idl={match.params.lectureId} />
                        )} />
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
