import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';

import {Switch,Route,Link} from 'react-router-dom';

import {AuthContext} from '../auth/AuthContext';

import '../App.css';
import '../customStyle.css';
import { FaHome }                  from "react-icons/fa";

class UserNavBar extends React.Component {

  constructor(props) {
    super(props);
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

    return (
      <AuthContext.Consumer>
          {(context) => (
              <>
              <Navbar id="navbar" bg="light" variant="light">
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
                  <label>Hello {context.authUser && context.authUser.name} </label>
                  <Link to='/'>
                    <Button onClick={event => context.logoutUser()}>Log out</Button>
                  </Link>
                </div>
              </Navbar>
              </>
            )}
        </AuthContext.Consumer>
    );

  }
}

export default UserNavBar;
