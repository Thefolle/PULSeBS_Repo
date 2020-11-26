import React from 'react';
import Route from 'react-router-dom/Route';
import { withRouter } from 'react-router-dom';
import LecturesList from './LecturesList';
import BookingsList from './BookingsList';
import UserNavBar from './Components/UserNavBar';
import StudentCalendar from "./Components/StudentCalendar";

import './App.css';
import API from './API/API';

import { FaBookOpen, FaCalendarAlt } from "react-icons/fa";
import { Button, Row, Col, Container, ListGroup, ListGroupItem } from "react-bootstrap";
import Switch from 'react-router-dom/Switch';

class StudentPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id, //this.props.user.id
            email: '',
            name: this.props.name,
            surname: this.props.surname,
            userType: 'student',
            lectures: [],
            bookings: [],
            bookingFailed: ''
        };

        this.getStudentLectures = this.getStudentLectures.bind(this);
        this.getStudentBookings = this.getStudentBookings.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }


    loadData = () => {

        API.getStudentLectures()
            .then((lectures) => {
                API.getStudentBookings()
                    .then((bookings) => {
                        this.setState((state, props) => ({ lectures: lectures, bookings: bookings }));
                    })
            })
    }


    handleErrors(err) {
        if (err) {
            if (err.status && err.status === 401) {
                this.setState({ authErr: err.errorObj });
                this.props.history.push("/");
            }
        }
        console.log("Error occured. Check the handleErrors method in studentPage.");
        console.log(err);
    }


    getStudentLectures = () => {
        console.log("Get lectures:");
        API.getStudentLectures().then((lectures) => { console.log("Lectures found correctly:"); console.log(lectures); this.setState({ lectures: lectures }); })
            .catch((errorObj) => {
                this.handleErrors(errorObj);
            });
    }

    getStudentBookings = () => {
        API.getStudentBookings().then((bookings) => { return bookings; })
            .catch((errorObj) => {
                this.handleErrors(errorObj);
            });
    }


    bookSeat = (lectureId) => {
        API.bookSeat(lectureId).then((result) => {
            if (result.ok) {
                this.setState({ failed: 0 });
                this.props.history.push("/StudentHome/bookings");
            } else {
                this.setState({ failed: 1 });
                //error page
            }
        }) //if SUCCEDED return 1
            .catch((errorObj) => {
                this.handleErrors(errorObj);
            });
    }



    //add Delete method in mybookings
    cancelBooking = (bookingID) => {
        API.cancelBooking(bookingID)
            .then(() => {
                //get the updated list of tasks from the server
                API.getStudentBookings().then((bookings) => this.setState({ bookings: bookings }));
            })
            .catch((errorObj) => {
                this.handleErrors(errorObj);
            });
    }



    render() {

        return (
            <>
                <UserNavBar userId={this.state.id} />
                {/* <div>
                    <Button className="btn btn-secondary" role="button" href="/StudentHome/lectures"
                        aria-expanded="false" aria-controls="collapseExample">
                        Lectures
                        <FaBookOpen className={"ml-1"} />
                    </Button>
                    <Button className="btn btn-secondary" role="button" href="/StudentHome/calendar"
                            aria-expanded="false" aria-controls="collapseExample">
                        My Calendar
                        <FaCalendarAlt className={"ml-1"} />
                    </Button>
                    <a type="button" className="btn btn-secondary" role="button" href="/StudentHome/bookings"
                        aria-expanded="false" aria-controls="collapseExample">
                        Bookings
                        <FaCalendarAlt className={"ml-1"} />
                    </a>
               </div> */}

                <Container>
                    <Row>
                        <Col sm={3} id="left-sidebar" className="collapse d-sm-block below-nav">
                            <ListGroup className="sidebar" variant="flush">
                            <h5>POLITECNICO DI TORINO</h5>
                                <ListGroup.Item className="listGroup-Item">name: {this.state.name}</ListGroup.Item>
                                <ListGroup.Item className="listGroup-Item">surname: {this.state.surname}</ListGroup.Item>
                                <ListGroup.Item className="listGroup-Item">id: {this.state.id}</ListGroup.Item>
                            </ListGroup>
                        </Col>

                        <Col sm={8}>

                            <Switch>
                                <Route exact path={this.props.match.url + "/lectures"}>
                                    <LecturesList lectures={this.state.lectures} bookings={this.state.bookings} bookSeat={this.bookSeat} alreadyBooked={this.alreadyBooked} />
                                </Route>
                                <Route exact path={this.props.match.url + "/bookings"}>
                                    <BookingsList bookings={this.state.bookings} cancelBooking={this.cancelBooking} />
                                </Route>
                                <Route exact path={this.props.match.url + "/calendar"}>
                                    <StudentCalendar bookings={this.state.bookings} />
                                </Route>
                            </Switch>

                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}


export default withRouter(StudentPage);

