import React          from 'react';
import Route          from 'react-router-dom/Route';
import { withRouter } from 'react-router-dom';
import Container      from 'react-bootstrap/Container';
import Row            from 'react-bootstrap/Row';
import LecturesList   from './LecturesList';
import BookingsList   from './BookingsList'
import './App.css';
import API            from './API/API';

import { FaBookOpen,FaCalendarAlt }              from "react-icons/fa";
import { Button }                  from "react-bootstrap";

class StudentPage extends React.Component {
    constructor( props ) {
        super( props );
        console.log(this.props);
        this.state = {
            id: this.props.id,
            email: '',
            name: this.props.name,
            surname: this.props.surname,
            userType: 'student',
            lectures: [],
            bookings: [],
            bookingFailed: ''
        };
    }

    loadData() {
        API.getStudentLectures()
           .then( ( lectures ) => {
               API.getStudentBookings()
                  .then( ( bookings ) => {
                      this.setState( ( state, props ) => ( {lectures: lectures, bookings: bookings} ) );
                  } )
           } )
    }


    handleErrors( err ) {
        if ( err ) {
            if ( err.status && err.status === 401 ) {
                this.setState( {authErr: err.errorObj} );
                this.props.history.push( "/" );
            }
        }
    }


    getStudentLectures = () => {
        API.getStudentLectures().then( ( lectures ) => { return lectures; } )
           .catch( ( errorObj ) => {
               this.handleErrors( errorObj );
           } );
    }

    getStudentBookings = () => {
        API.getStudentBookings().then( ( bookings ) => { return bookings; } )
           .catch( ( errorObj ) => {
               this.handleErrors( errorObj );
           } );
    }


    bookSeat = ( lectureId ) => {
        API.bookSeat( lectureId ).then( ( result ) => {
            console.log( result );
            if ( result.ok ) {
                this.setState( {failed: 0} );
                this.props.history.push("/StudentHome/bookings");
            } else {
                this.setState( {failed: 1} );
                //error page
            }
        } ) //if SUCCEDED return 1
           .catch( ( errorObj ) => {
               this.handleErrors( errorObj );
           } );
    }



    //add Delete method in mybookings
    cancelBooking = (bookings) => {
        API.cancelBooking(bookings.id)
          .then(() => {
            //get the updated list of tasks from the server
            API.getStudentBookings().then((bookings) => this.setState({bookings: bookings}));
          })
          .catch((errorObj) => {
            this.handleErrors(errorObj);
          });
      }


    
    render() {
        this.loadData();
        return (
            //TODO: Header & put buttons into the nav bar and create the student home page
            <Container fluid>
                <Row className="vheight-100">
                    <div className="btn-group" role="group" aria-label="Basic example" style={ {margin: '10px'}}>
                        <Button className="btn btn-secondary" role="button" href="/StudentHome/lectures"
                                aria-expanded="false" aria-controls="collapseExample">
                            Lectures
                            <FaBookOpen className={"ml-1"}/>
                        </Button>
                        <a type="button" className="btn btn-secondary" role="button" href="/StudentHome/bookings"
                           aria-expanded="false" aria-controls="collapseExample">
                            Bookings
                            <FaCalendarAlt className={"ml-1"} />
                        </a>
                    </div>
                </Row>
                <Route exact path={ this.props.match.url + "/lectures" }>
                    <LecturesList lectures={ this.state.lectures } bookings={this.state.bookings} bookSeat={ this.bookSeat } alreadyBooked={ this.alreadyBooked }/>
                </Route>
                <Route exact path={ this.props.match.url + "/bookings" }>
                    <BookingsList bookings={ this.state.bookings } cancelBookings = {this.cancelBooking} />
                </Route>

            </Container>
        );
    }
}


export default withRouter( StudentPage );

