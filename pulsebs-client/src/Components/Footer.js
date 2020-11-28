import React from 'react';

const Footer = (props) => {

    return (
        <>
            <div id="footer" className="navbar navbar-inverse navbar-fixed-bottom">
                <div className="container">
                    <div>
                      <p id="footer-text-left">Contatti</p>
                    </div>
                    <div>
                      <p id="footer-text-right"> © Politecnico di Torino </p>
                      <p id="footer-text-right">Corso Duca degli Abruzzi, 24 - 10129 Torino, ITALY </p>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Footer;
