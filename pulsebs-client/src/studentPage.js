import React from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import { withRouter } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LecturesList from './LecturesList';
import BookingsList from './BookingsList'
import logo from './logo.svg';
import './App.css';
import API from './API/API';

import { BrowserRouter as Router } from 'react-router-dom';
import Redirect from 'react-router-dom/Redirect';


class StudentPage extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = { id: props.id, email: '', name: props.name, surname: props.surname, userType: 'student', lectures: [], bookings: [], bookingFailed: ''};
      }

      componentDidMount() {
        API.getStudentLectures()
            .then((lectures) => {
              API.getStudentBookings()
              .then((bookings) => {
              this.setState((state, props) => ({lectures: lectures, bookings: bookings}));
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
      }
    
    
      getStudentLectures = () => {
        API.getStudentLectures().then((lectures) => this.setState({ lectures: lectures }))
          .catch((errorObj) => {
            this.handleErrors(errorObj);
          });
      }
    
      getStudentReservations = () => {
        API.getStudentReservations().then((bookings) => this.setState({ bookings: bookings }))
        .catch((errorObj) => {
          this.handleErrors(errorObj);
        });
      }
    
      bookSeat = (lecture) => {
        API.bookSeat(lecture).then((result) => { 
          console.log(result);
          if(result === 1){
            this.setState({failed: 0});
            this.props.history.push("/bookings"); 
          }else{
            this.setState({failed: 1});
            //error page
          }
        }) //if SUCCEDED return 1
        .catch((errorObj) => {
          this.handleErrors(errorObj);
        });
      }
    
      //add Delete method in mybookings 
    
      render() {
        return (
          //TODO: Header & put buttons into the nav bar and create the student home page  
          <Container fluid>   
             {/*<Switch>*/}
              {/* <Route path={this.props.match.url}>*/}
                <Row className="vheight-100">
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <a type="button" className="btn btn-secondary" role="button" href="/StudentHome/lectures" aria-expanded="false" aria-controls="collapseExample">
                      Lectures 
                    </a>
                    <a type="button" className="btn btn-secondary" role="button" href="/StudentHome/bookings" aria-expanded="false" aria-controls="collapseExample">
                      Bookings
                    </a>
                  </div>
                </Row>
               {/* </Route> */}
              <Switch>  
               <Route exact path={this.props.match.url + "/lectures"}>
                  <LecturesList lectures = {this.state.lectures} bookSeat = {this.bookSeat}/>
                 </Route>
              <Route exact path={this.props.match.url + "/bookings"}>
                <BookingsList bookings = {this.state.bookings}/>
              </Route> 
            </Switch>

          </Container>
        );
      }
    }
    
    
    export default withRouter(StudentPage);

    