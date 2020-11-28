import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {NavLink} from 'react-router-dom';

const Header = (props) => {

  return(
      <>
    <header id="banner" class="header py-3">
        <img class='logo' id="logo-polito" src='/svg/polito.svg'  />
        <div id="header-text"><h3>Portale della didattica</h3></div>
     </header>	
    </> 
 )}

export default Header;
