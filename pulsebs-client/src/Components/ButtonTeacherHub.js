import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const ButtonTeacherHub=(props)=>{
    return(
        <Container fluid>
              <Row className="vheight-100">
                  <div><Link to='/teacher/courses'><Button>Lectures of my Courses</Button></Link></div> 
              </Row>
               
               
          </Container>
    );
}

export default ButtonTeacherHub;