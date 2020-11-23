import React from 'react';

import API from '../API/API';
import Navbar from 'react-bootstrap/Navbar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';

import { BrowserRouter as Router } from 'react-router-dom';
import Switch                      from 'react-router-dom/Switch';
import Route                       from 'react-router-dom/Route';
import Link                        from 'react-router-dom/Link';

import '../App.css';
import '../customStyle.css';
import { FaHome }                  from "react-icons/fa";

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

    let brand = <Navbar.Brand>
      <OverlayTrigger
        placement='bottom'
        overlay={
          <Tooltip>
            Home
          </Tooltip>
        }
      >
        <FaHome />
      </OverlayTrigger>

    </Navbar.Brand>;

    return <Navbar id="navbar" bg="light" variant="light">
      <Switch>
        <Route path='/StudentHome'>
          <Link to='/StudentHome'>
            {brand}
          </Link>
        </Route>
        <Route exact path='/StudentHome'>
          {/* The property tabs has to be an array of div elements; each div is rendered as a group, while each div can contain multiple items */}
          {this.props.tabs}
        </Route>
        <Route path='/teacher'>
          <Link to='/teacher'>
            {brand}
          </Link>
        </Route>
        <Route exact path='/teacher'>
          {this.props.tabs}
        </Route>
      </Switch>
      <div>
        <label>Hello</label>
        <Link to='/'>
          <Button onClick={event => this.logout()}>Log out</Button>
        </Link>
      </div>
    </Navbar>;
  }
}

export default UserNavBar;