import React from 'react';
import {Route} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import {Switch} from 'react-router-dom';
import {AuthContext} from './auth/AuthContext';
import { Row, Col, Container, ListGroup} from "react-bootstrap";


import LecturesList from './LecturesList';
import BookingsList from './BookingsList';
import WaitingList from './Components/waitings/WaitingList';
import UserNavBar from './Components/UserNavBar';
import StudentCalendar from "./Components/StudentCalendar";
import './App.css';
import API from './API/API';



class StudentPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userType: 'student',
            waitings: [],
            lectures: [],
            bookings: [],
            bookingFailed: ''
        };

        //these lines can be removed
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
                    // Feihong 
                    // add waiting status, below next 6 lines
                    API.getWaitingList().then((waitings) =>{
                        this.setState({ waitings: waitings, lectures: lectures.sort(function (a, b) {
                                        return a.date - b.date || a.course - b.course ||  a.surname - b.surname || a.name - b.name || a.id - b.id;
                                    }), bookings: bookings });
                    })
                    .catch((err) => {
                        this.handleErrors(err)
                    })
                  })
                  .catch((err) => {
                      this.handleErrors(err);
                  });
          }).catch((err) => {
              this.handleErrors(err);
      });
    }


    handleErrors=(err)=> {
        if (err) {
            if (err.status && err.status === 401) {
                this.setState({ authErr: err });
                this.props.history.push("/");
            }else{
                //other errors that may happens and choose the page in which are displayed
                this.setState({ authErr: err });
            }
        }
        console.log("Error occured. Check the handleErrors method in studentPage.");
        console.log(err);
    }

    /**
     * @Feihong
     */
    getWaitingList = () =>{
        API.getWaitingList().then((waitings) => {
            this.setState({waitings: waitings})
        })
        .catch((errorObj) => {
            this.handleErrors(errorObj)
        })
    }

    getStudentLectures = () => {
        API.getStudentLectures().then((lectures) => { 
            this.setState({ lectures: lectures }); })
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


    bookSeat = (studentId, lectureId) => {
       
                if(window.confirm("Do you want BOOK this lecture")){
                    API.bookSeat(studentId, lectureId).then((result) => {
                        if (result.ok) {
                           //get the updated list of tasks from the server
                           API.getStudentBookings().then((bookings) => this.setState({ bookings: bookings }));
                           this.props.history.push("/student/bookings");
                        } else {
                            this.setState({ failed: 1 });
                            //error page
                        }
                    }) //if SUCCEDED return 1
                    .catch((errorObj) => {
                        this.handleErrors(errorObj);
                    });
                }

    }



    /**
     * @Feihong
     */
    //add Delete method in mybookings
    // FIXME:   already successfully refactor the URI 
    // TODO: add a student to the booking table from waiting table
    cancelBooking = (studentId, bookingId) => {
        API.cancelBooking(studentId, bookingId)
            .then(() => {
                //get the updated list of tasks from the server
                API.getStudentBookings().then((bookings) => this.setState({ bookings: bookings }));
                console.log(this.state.bookings);
            })
            .catch((errorObj) => {
                this.handleErrors(errorObj);
            });
    }

    /**
     * @Feihong
     * @param {*} studentId 
     * @param {*} lectureId 
     */
    // TODO: delete a waiting item and add a this student and lecture to book table
    deleteWaitingAddBooking = (studentId, lectureId, bookingId) => {
       if(window.confirm("If you cancel this book, may be there is another student will book your seat")){
           API.deleteWaitingAddBooking(studentId, lectureId)
                .then(() => {
                    this.cancelBooking(studentId,bookingId);
                    alert('delete and add successful')
                })
                .catch((errorObj)=>{
                    alert('delete and add failed')
                    this.handleErrors(errorObj)
                })
       }
    }


    /**
     * @Feihong
     * Add a student to waiting list of lecture
     */
    // TODO: 
    addStudentToWaitingList = (studentId, lectureId) => {
        if(window.confirm("Because there is no free seat anymore. Do you want add to the WATING LIST of this lecture")){
            API.addStudentToWaitingList(studentId, lectureId)
                .then((result) => {
                    if (result.ok) {
                    //get the updated list of tasks from the server
                    API.getStudentLectures().then((lectures) => { 
                        this.setState({ lectures: lectures })
                    });
                    API.getWaitingList().then((waitings) => {
                        this.setState({waitings: waitings})
                    });
                    this.props.history.push("/student/bookings");
                    } else {
                        this.setState({ failed: 1 });
                        //error page
                    }
                }) //if SUCCEDED return 1
                .catch((errorObj) => {
                    this.handleErrors(errorObj);
                });
        }
    }
    
    /**
     * @Feihong
     */
    // TODO:
    upDateBookable = (studentId, lectures) => {

        for (var i=0; i<lectures.length; i++){
            API.checkSeatsOfLecture(studentId, lectures[i].id).then( (result) => {    
            })
        }
    }


    getBookingId = (lectureId) => {
            let id = this.state.bookings.filter(function(b){ return b.ref_lecture === lectureId; }).map((b) => b.id )[0];
           return id; 
    }   


    render() {

            return (
              <AuthContext.Consumer>
                  {(context)=>(
                     <>
                  {context.authUser && <>
                    <UserNavBar userId={context.authUser.id}/>
                    <Container>
                    <Row>
                        <Col sm={3} id="left-sidebar" className="collapse d-sm-block below-nav">
                            <ListGroup className="sidebar" variant="flush">
                            <h5>POLITECNICO DI TORINO</h5>
                                <ListGroup.Item className="listGroup-Item"> {context.authUser.name}</ListGroup.Item>
                                <ListGroup.Item className="listGroup-Item"> {context.authUser.surname}</ListGroup.Item>
                                <ListGroup.Item className="listGroup-Item"> {context.authUser.id}</ListGroup.Item>
                            </ListGroup>
                        </Col>

                        <Col sm={8}>

                        <Switch>
                            <Route exact path={this.props.match.url + "/lectures"}>
                                <LecturesList lectures={this.state.lectures} bookings={this.state.bookings}
                                    bookSeat={this.bookSeat} alreadyBooked={this.alreadyBooked}
                                    cancelBooking={this.cancelBooking}
                                    onload= { this.upDateBookable(context.authUser.id, this.state.lectures) }
                                    waitings = {this.state.waitings} 
                                    addStudentToWaitingList={this.addStudentToWaitingList}
                                    deleteWaitingAddBooking={this.deleteWaitingAddBooking}
                                    getBookingId={this.getBookingId}
                                />
                            </Route>
                            <Route exact path={this.props.match.url + "/bookings"}>
                                <BookingsList deleteWaitingAddBooking={this.deleteWaitingAddBooking}  bookings={this.state.bookings} waitings = {this.state.waitings} cancelBooking={this.cancelBooking} />
                            </Route>
                            <Route exact path={this.props.match.url + "/calendar"}>
                                <StudentCalendar bookings={this.state.bookings} />
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


export default withRouter(StudentPage);
