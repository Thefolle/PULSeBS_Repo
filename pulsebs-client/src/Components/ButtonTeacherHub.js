import React     from 'react';
import Container from 'react-bootstrap/Container';
import Row       from 'react-bootstrap/Row';
import { Link }  from 'react-router-dom';

const ButtonTeacherHub = ( props ) => {
    return (
        <Container fluid>
            <Row className="vheight-100">
                <div className={ "btn btn-primary" } style={{margin: "10px"}}><Link to='/teacher/courses'
                                                           style={ {color: "white"} }>Lectures of my
                    Courses</Link></div>
            </Row>
        </Container>
    );
}

export default ButtonTeacherHub;