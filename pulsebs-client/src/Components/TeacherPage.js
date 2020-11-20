import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import API from '../API/API';
import CourseList from './CourseList';
import LectureList from './LectureList';
import StudentList from './StudentiList';
import ButtonTeacherHub from './ButtonTeacherHub';
import UserNavBar from './UserNavBar';
import { Link } from 'react-router-dom';

import '../App.css';
import '../customStyle.css';

class TeacherPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            email: '',
            name: this.props.name,
            surname: this.props.surname,
            userType: 'teacher',
            lectures: [],
            courses: [],
            students: []
        };
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
                        <LectureList lectures={this.state.lectures} idc={match.params.courseId} getLectures={this.getTeacherLectures} />
                    )} />
                    <Route exact path={"/teacher/:courseId/:lectureId/students"} render={({ match }) => (
                        <StudentList students={this.state.students} idl={match.params.lectureId} getLectures={this.getTeacherLectures} />
                    )} />
                </Switch>
            </>

        );
    }
}

export default withRouter(TeacherPage);
