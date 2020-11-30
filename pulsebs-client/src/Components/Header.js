import React from 'react';

const Header = (props) => {

  return(
      <>
    <header id="banner" className="header py-3">
        <img className='logo' id="logo-polito" src='/svg/polito.svg'  />
        <div id="header-text"><h3>Portale della didattica</h3></div>
     </header>
    </>
 );
}

export default Header;
