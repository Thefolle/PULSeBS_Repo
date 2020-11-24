import React from 'react';

import API from '../API/API';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

import { FaBookOpen, FaCalendarAlt, FaHome, FaUserCircle } from "react-icons/fa";

import { BrowserRouter as Router } from 'react-router-dom';
import Switch                      from 'react-router-dom/Switch';
import Route                       from 'react-router-dom/Route';
import Link                        from 'react-router-dom/Link';

import '../App.css';
import '../customStyle.css';

class UserNavBar extends React.Component {

  constructor(props) {
    super(props);
  }

  logout() {
    API.logout().then(() => {
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {

   /* let brand = <Navbar.Brand>
      <OverlayTrigger
        placement='bottom'
        overlay={
          <Tooltip>
            Home
          </Tooltip>
        }
      >
         <Image src="/svg/logo.svg" width='40' height='40' rounded />
      </OverlayTrigger>

    </Navbar.Brand>;
    */

    return <Navbar id="menu-navbar" expand="sm" variant="dark">
      <Switch>
        <Route path='/StudentHome'>
        <Navbar.Collapse id="basic-navbar-nav">
         <Nav className="mr-auto">
          <Nav.Link href='/StudentHome'> Home <FaHome className={"ml-0.5"} /></Nav.Link>
          <Nav.Link href='/StudentHome/lectures'> Lectures <FaBookOpen className={"ml-0.5"} /> </Nav.Link>
          <Nav.Link href='/StudentHome/bookings'> Bookings <FaCalendarAlt className={"ml-0.5"} /> </Nav.Link>
          <Nav.Link href='/StudentHome/calendar'> Calendar <FaCalendarAlt className={"ml-0.5"} /> </Nav.Link>
          </Nav>
         </Navbar.Collapse> 
        </Route>
        <Route exact path='/StudentHome'>
          {/* The property tabs has to be an array of div elements; each div is rendered as a group, while each div can contain multiple items */}
          {this.props.tabs}
        </Route>
        <Route path='/teacher'>
        <Navbar.Collapse id="basic-navbar-nav">
         <Nav className="mr-auto">
          <Nav.Link href='/teacher'> Home <FaHome className={"ml-0.5"} /></Nav.Link>
          <Nav.Link href='/teacher/courses'> Courses <FaBookOpen className={"ml-0.5"} /> </Nav.Link>
          </Nav>
         </Navbar.Collapse>
        </Route>
        <Route exact path='/teacher'>
          {this.props.tabs}
        </Route>
      </Switch>
        <Navbar.Brand> <FaUserCircle className={"ml-1"}/> {this.props.userId} </Navbar.Brand>  
       <div> 
        <Link to='/'>
          <Nav.Link id="logout-button" onClick={event => this.logout()}>Log out</Nav.Link>
        </Link>
      </div>
    </Navbar>;
  }
}

export default UserNavBar;