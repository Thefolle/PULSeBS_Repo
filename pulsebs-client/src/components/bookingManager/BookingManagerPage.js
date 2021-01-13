import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import { Route, Switch, withRouter } from 'react-router-dom';
import API from '../../API/API';
import { AuthContext } from '../../auth/AuthContext';
import '../../style/App.css';
import '../../style/customStyle.css';
import NavigationBar from '../NavigationBar';
import BookingsStatistics from './BookingsStatistics';
import ContactTracing from './ContactTracing';
import DropDown from './DropDown';
import Tutorial from '../Tutorial';

class BookingManagerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lecture: -1, //All lectures = -1
            course: "All", // All courses=All
            courses: [],
            lectures: [],
            bookings: [],
            cancellations: [],
            attendances: [],
            cancellationsBookings: []
        };
    }

    componentDidMount() {
        API.getAllCourses().then((courses) => {
            API.getAllLectures().then((lectures) => {
                API.getAllBookings(this.state.course, this.state.lecture).then((bookings) => {
                    API.getAllAttendances(this.state.course, this.state.lecture).then((attendances) => {
                        API.getAllCancellationsLectures(this.state.course, this.state.lecture).then((cancellations) => {
                            API.getAllCancellationsBookings(this.state.course, this.state.lecture).then((cancellationsB) => {
                                this.setState({ courses: courses });
                                this.setState({ lectures: lectures });
                                this.setState({
                                    bookings: bookings.sort(function (a, b) {
                                        return a.dataStart - b.dataStart || a.course - b.course || a.userSurname - b.userSurname || a.userName - b.userName || a.userId - b.userId;
                                    })
                                });
                                this.setState({
                                    attendances: attendances.sort(function (a, b) {
                                        return a.dataStart - b.dataStart || a.course - b.course || a.userSurname - b.userSurname || a.userName - b.userName || a.userId - b.userId
                                    })
                                });
                                this.setState({
                                    cancellations: cancellations.sort(function (a, b) {
                                        return a.dataStart - b.dataStart || a.course - b.course || a.userSurname - b.userSurname || a.userName - b.userName || a.userId - b.userId;
                                    })
                                });
                                this.setState({
                                    cancellationsBookings: cancellationsB.sort(function (a, b) {
                                        return a.dataStart - b.dataStart || a.course - b.course || a.userSurname - b.userSurname || a.userName - b.userName || a.userId - b.userId
                                    })
                                });
                            }).catch((err) => {
                                this.handleErrors(err);
                            });
                        }).catch((err) => {
                            this.handleErrors(err);
                        });
                    }).catch((err) => {
                        this.handleErrors(err);
                    });
                }).catch((err) => {
                    this.handleErrors(err);
                });
            }).catch((err) => {
                this.handleErrors(err);
            });
        }).catch((err) => {
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
        console.log("Error occured. Check the handleErrors method in BookingManager.");
        console.log(err);
    }

    updateCourse = (course) => {
        API.getAllBookings(course, this.state.lecture).then((attendances) => {
            API.getAllAttendances(course, this.state.lecture).then((bookings) => {
                API.getAllCancellationsLectures(course, this.state.lecture).then((cancellations) => {
                    API.getAllCancellationsBookings(course, this.state.lecture).then((cancellationsB) => {
                        this.setState({ course: course });
                        this.setState({
                            bookings: bookings.sort(function (a, b) {
                                return a.dataStart - b.dataStart || a.course - b.course || a.userSurname - b.userSurname || a.userName - b.userName || a.userId - b.userId;
                            })
                        });
                        this.setState({
                            attendances: attendances.sort(function (a, b) {
                                return a.dataStart - b.dataStart || a.course - b.course || a.userSurname - b.userSurname || a.userName - b.userName || a.userId - b.userId;
                            })
                        });
                        this.setState({
                            cancellations: cancellations.sort(function (a, b) {
                                return a.dataStart - b.dataStart || a.course - b.course || a.userSurname - b.userSurname || a.userName - b.userName || a.userId - b.userId;
                            })
                        });
                        this.setState({
                            cancellationsBookings: cancellationsB.sort(function (a, b) {
                                return a.dataStart - b.dataStart || a.course - b.course || a.userSurname - b.userSurname || a.userName - b.userName || a.userId - b.userId;
                            })
                        });
                    }).catch((err) => {
                        this.handleErrors(err);
                    });
                }).catch((err) => {
                    this.handleErrors(err);
                });
            }).catch((err) => {
                this.handleErrors(err);
            });
        }).catch((err) => {
            this.handleErrors(err);
        });
    }

    updateLecture = (lecture) => {
        API.getAllBookings(this.state.course, lecture).then((bookings) => {
            API.getAllAttendances(this.state.course, lecture).then((attendances) => {
                API.getAllCancellationsLectures(this.state.course, lecture).then((cancellations) => {
                    API.getAllCancellationsBookings(this.state.course, lecture).then((cancellationsB) => {
                        this.setState({ lecture: parseInt(lecture) });
                        this.setState({ bookings: bookings });
                        this.setState({
                            attendances: attendances.sort(function (a, b) {
                                return a.dataStart - b.dataStart || a.course - b.course || a.userSurname - b.userSurname || a.userName - b.userName || a.userId - b.userId;
                            })
                        });
                        this.setState({
                            cancellations: cancellations.sort(function (a, b) {
                                return a.dataStart - b.dataStart || a.course - b.course || a.userSurname - b.userSurname || a.userName - b.userName || a.userId - b.userId;
                            })
                        });
                        this.setState({
                            cancellationsBookings: cancellationsB.sort(function (a, b) {
                                return a.dataStart - b.dataStart || a.course - b.course || a.userSurname - b.userSurname || a.userName - b.userName || a.userId - b.userId;
                            })
                        });
                    }).catch((err) => {
                        this.handleErrors(err);
                    });
                }).catch((err) => {
                    this.handleErrors(err);
                });
            }).catch((err) => {
                this.handleErrors(err);
            });
        }).catch((err) => {
            this.handleErrors(err);
        });

    }



    render() {

        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        {context.authUser && <>
                            <NavigationBar userId={context.authUser.id} />
                            <Container style={{height: '100%'}} fluid>
                                <Row style={{justifyContent: 'space-evenly', height: '100%'}}>
                                    <Col sm={3}>
                                        <ListGroup  className="sidebar" variant="flush">
                                            <h5>POLITECNICO DI TORINO</h5>
                                            <h3>Booking manager</h3>
                                            <ListGroup.Item className="listGroup-Item"> {context.authUser.name}</ListGroup.Item>
                                            <ListGroup.Item className="listGroup-Item"> {context.authUser.surname}</ListGroup.Item>
                                            <ListGroup.Item className="listGroup-Item">
                                                <Tutorial on={true} text='This is your identification number.' push={
                                                    context.authUser.id
                                                } />
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                    <Col sm={8}>
                                        <Switch>
                                            <Route exact path={"/manager/allStats"}>
                                                <Row>
                                                    <Col>
                                                        <label>Course:</label>
                                                        <DropDown options={["All", ...new Set(this.state.courses.map(course => course.course))]} update={this.updateCourse} />
                                                    </Col>
                                                    <Col>
                                                        <label>Lecture:</label>
                                                        <DropDown options={[-1, ...new Set(this.state.lectures.map(lec => lec.lecId))]} update={this.updateLecture} />
                                                    </Col>
                                                </Row>
                                                <br />
                                                <BookingsStatistics bookings={this.state.bookings} type={1} />
                                                <br />
                                                <BookingsStatistics bookings={this.state.cancellations} type={2} />
                                                <br />
                                                <BookingsStatistics bookings={this.state.cancellationsBookings} type={3} />
                                                <br />
                                                <BookingsStatistics bookings={this.state.attendances} type={0} />
                                            </Route>
                                            <Route exact path={"/manager/bookings"}>
                                                <Row>
                                                    <Col>
                                                        <label>Course:</label>
                                                        <DropDown options={["All", ...new Set(this.state.courses.map(course => course.course))]} update={this.updateCourse} />
                                                    </Col>
                                                    <Col>
                                                        <label>Lecture:</label>
                                                        <DropDown options={[-1, ...new Set(this.state.lectures.map(lec => lec.lecId))]} update={this.updateLecture} />
                                                    </Col>
                                                </Row>
                                                <BookingsStatistics bookings={this.state.bookings} type={1} />
                                            </Route>
                                            <Route exact path={"/manager/cancellationsLectures"}>
                                                <Row>
                                                    <Col>
                                                        <label>Course:</label>
                                                        <DropDown options={["All", ...new Set(this.state.courses.map(course => course.course))]} update={this.updateCourse} />
                                                    </Col>
                                                    <Col>
                                                        <label>Lecture:</label>
                                                        <DropDown options={[-1, ...new Set(this.state.lectures.map(lec => lec.lecId))]} update={this.updateLecture} />
                                                    </Col>
                                                </Row>
                                                <BookingsStatistics bookings={this.state.cancellations} type={2} />
                                            </Route>
                                            <Route exact path={"/manager/cancellationsBookings"}>
                                                <Row>
                                                    <Col>
                                                        <label>Course:</label>
                                                        <DropDown options={["All", ...new Set(this.state.courses.map(course => course.course))]} update={this.updateCourse} />
                                                    </Col>
                                                    <Col>
                                                        <label>Lecture:</label>
                                                        <DropDown options={[-1, ...new Set(this.state.lectures.map(lec => lec.lecId))]} update={this.updateLecture} />
                                                    </Col>
                                                </Row>
                                                <BookingsStatistics bookings={this.state.cancellationsBookings} type={3} />
                                            </Route>
                                            <Route exact path={"/manager/attendances"}>
                                                <Row>
                                                    <Col>
                                                        <label>Course:</label>
                                                        <DropDown options={["All", ...new Set(this.state.courses.map(course => course.course))]} update={this.updateCourse} />
                                                    </Col>
                                                    <Col>
                                                        <label>Lecture:</label>
                                                        <DropDown options={[-1, ...new Set(this.state.lectures.map(lec => lec.lecId))]} update={this.updateLecture} />
                                                    </Col>
                                                </Row>
                                                <BookingsStatistics bookings={this.state.attendances} type={0} />
                                            </Route>
                                            <Route exact path={"/manager/tracing"}>
                                                <ContactTracing />
                                            </Route>
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

export default withRouter(BookingManagerPage);