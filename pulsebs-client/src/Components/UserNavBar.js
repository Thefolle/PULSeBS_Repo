import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import { LinkContainer } from "react-router-bootstrap";
import {Switch,Route} from 'react-router-dom';

import {AuthContext} from '../auth/AuthContext';
import { FaBookOpen, FaCalendarAlt, FaUserCircle } from "react-icons/fa";

import '../App.css';
import '../customStyle.css';

class UserNavBar extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <AuthContext.Consumer>
          {(context) => (
              <>
              <Navbar id="menu-navbar" expand="sm" variant="dark">
                <Switch>
                  <Route path='/student'>
                  <Navbar.Collapse id="basic-navbar-nav">
                   <Nav className="mr-auto">
                    {/*<Nav.Link href='/student'> Home <FaHome className={"ml-0.5"} /></Nav.Link>*/}
                    <Nav.Link href='/student/lectures'> Lectures <FaBookOpen className={"ml-0.5"} /> </Nav.Link>
                    <Nav.Link href='/student/bookings'> Bookings <FaCalendarAlt className={"ml-0.5"} /> </Nav.Link>
                    <Nav.Link href='/student/calendar'> Calendar <FaCalendarAlt className={"ml-0.5"} /> </Nav.Link>
                    </Nav>
                   </Navbar.Collapse>
                  </Route>
                  <Route path='/teacher'>
                  <Navbar.Collapse id="basic-navbar-nav">
                   <Nav className="mr-auto">
                    <Nav.Link href='/teacher/courses'> Courses <FaBookOpen className={"ml-0.5"} /> </Nav.Link>
                    </Nav>
                   </Navbar.Collapse>
                  </Route>
                  <Route path='/supportOffice'>
                  <Navbar.Collapse id="basic-navbar-nav">
                   <Nav className="mr-auto">
                    {/* <Nav.Link href='/supportOffice'>  </Nav.Link> */ }
                    </Nav>
                   </Navbar.Collapse>
                  </Route>
                </Switch>
                  <Navbar.Brand> <FaUserCircle className={"ml-1"}/> {this.props.userId} </Navbar.Brand>
                 <div>
                  <LinkContainer to='/'>
                    <Nav.Link id="logout-button" onClick={event => context.logoutUser()}>Log out</Nav.Link>
                  </LinkContainer>
                </div>
              </Navbar>
              </>
              )}
        </AuthContext.Consumer>
    );
  }
}

export default UserNavBar;
