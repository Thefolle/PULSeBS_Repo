import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import { LinkContainer } from "react-router-bootstrap";
import { Switch, Route } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import {AiOutlineTable} from 'react-icons/ai';
import { FaBookOpen, FaCalendarAlt, FaUserCircle} from "react-icons/fa";
import { IoIosStats } from 'react-icons/io';
import { RiVirusFill } from 'react-icons/ri'

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
                      <Nav.Link href={`/teacher/${this.props.userId}/statistics/courses`}> Statistics <IoIosStats className={"ml-0.5"} /></Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
                </Route>
                <Route path='/manager'>
                  <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                      <Nav.Link href="/manager/allStats">All <AiOutlineTable className={"ml-0.5"} /></Nav.Link>
                      <Nav.Link href="/manager/bookings">Bookings <AiOutlineTable className={"ml-0.5"} /></Nav.Link>
                      <Nav.Link href="/manager/cancellationsLectures">Cancellations Lectures <AiOutlineTable className={"ml-0.5"} /></Nav.Link>
                      <Nav.Link href="/manager/cancellationsBookings">Cancellations Bookings <AiOutlineTable className={"ml-0.5"} /></Nav.Link>
                      <Nav.Link href="/manager/attendances">Attendances <AiOutlineTable className={"ml-0.5"} /></Nav.Link>
                      <Nav.Link href="/manager/tracing">Contact tracing <RiVirusFill className={"ml-0.5"} /></Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
                </Route>
                <Route path='/supportOffice'>
                  <Navbar.Collapse id="basic-navbar-nav">
                   <Nav className="mr-auto">
                    </Nav>
                   </Navbar.Collapse>
                  </Route>
              </Switch>
              <Navbar.Brand> <FaUserCircle className={"ml-1"} /> {this.props.userId} </Navbar.Brand>
              <div>
                <LinkContainer to='/'>
                  <Nav.Link id="logout-button" onClick={() => context.logoutUser()}>Log out</Nav.Link>
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
