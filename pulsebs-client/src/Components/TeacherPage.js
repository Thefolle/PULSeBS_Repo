import React from 'react';
import { withRouter, Switch, Route} from 'react-router-dom';

import API from '../API/API';
import CourseList from './CourseList';
import LectureList from './LectureList';
import StudentList from './StudentiList';
import UserNavBar from './UserNavBar';
import { Link } from 'react-router-dom';
import {AuthContext} from '../auth/AuthContext';

import '../App.css';
import '../customStyle.css';

class TeacherPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lectures: [],
            courses: [],
            students: []
        };
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

    render() {

        return (
            <AuthContext.Consumer>
                {(context)=>(
                    <>
                    <UserNavBar />
                    <div className={"btn btn-primary"} style={{ margin: "10px" }}>
                        <Link to='/teacher/courses' style={{ color: "white" }}>
                            Lectures of my Courses
                        </Link>
                    </div>
                    <Switch>
                        <Route exact path={"/teacher/courses"}>
                            <CourseList courses={this.state.courses} />
                        </Route>
                        <Route exact path={"/teacher/:courseId/lectures"} render={({ match }) => (
                            <LectureList lectures={this.state.lectures} idc={match.params.courseId}  />
                        )} />
                        <Route exact path={"/teacher/:courseId/:lectureId/students"} render={({ match }) => (
                            <StudentList students={this.state.students} idl={match.params.lectureId} />
                        )} />
                    </Switch>
                    </>
                  )}
            </AuthContext.Consumer>

        );
    }
}

export default withRouter(TeacherPage);
