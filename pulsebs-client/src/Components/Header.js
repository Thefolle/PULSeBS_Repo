import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {NavLink} from 'react-router-dom';

const Header = (props) => {

   // let {user} = props;

  return(
      <>
    <header id="banner" class="header py-3">
        <img class='logo' id="logo-polito" src='/svg/polito.svg'  />
     </header>	
    {/*user &&		
        <div id="menu-top" class="nav-scroller py-1 mb-2">
             <UserNavBar user={user} logout={logout}/>
        </div>  
    */ } 
    </> 
 )};

export default Header;
