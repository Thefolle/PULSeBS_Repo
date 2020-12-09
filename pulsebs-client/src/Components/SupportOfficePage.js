import React from 'react';
import {Route} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Papa } from 'papaparse/papaparse/';
import UserNavBar from '../Components/UserNavBar';

import '../App.css';

import {Switch} from 'react-router-dom';
import {AuthContext} from '../auth/AuthContext';
import { Row, Col, Container, ListGroup} from "react-bootstrap";

class SupportOfficePage extends React.Component {

    constructor() {
        super();
        this.state = {
          studentscsv: undefined, students: [], teacherscsv: undefined, teachers: [], coursescsv: undefined, courses: [], enrollmcsv: undefined, enrollements: []
        };
        this.updateStudentsData = this.updateStudentsData.bind(this);
      }
    
      handleChange = event => {
          console.log(event.target.files[0]);
        this.setState({
          [event.target.name]: event.target.files[0] //_csv: file
        });
      };
    
      importCSV = () => {
        const { studentscsv } = this.state;

        var Papa = require("papaparse/papaparse.min.js");

        Papa.parse(studentscsv, {
          complete: this.updateStudentsData,
          header: true
        });
      };
    
      updateStudentsData(result) {
        var data = result.data.map(e => ({id: e.Id, name: e.Name, city: e.City, email: e.OfficialEmail, bday: e.Birthday, ssn: e.SSN}));
        console.log(data);
        this.setState({students: data});
        //API.importStudents(data);
        //or set param in the state .setState({students: students})
        //in the 2case add a button to send all the data to the proper API which will process them
        //!!!!!sistema parametri studente con quelli di fra
      }


    handleErrors=(err)=> {
        if (err) {
            if (err.status && err.status === 401) {
                this.setState({ authErr: err });
                this.props.history.push("/");
            }else{
                //other errors that may happens and choose the page in which are displayed
                this.setState({ authErr: err });
            }
        }
        console.log("Error occured. Check the handleErrors method in studentPage.");
        console.log(err);
    }




    render() {

            return (
              <AuthContext.Consumer>
                  {(context)=>(
                     <> 
                  {context.authUser && <>
                    <UserNavBar userId={context.authUser.id}/>
                    <Container>
                    <Row>
                        <Col sm={3} id="left-sidebar" className="collapse d-sm-block below-nav">
                            <ListGroup className="sidebar" variant="flush">
                            <h5>POLITECNICO DI TORINO</h5>
                                <h3>SUPPORT OFFICE</h3>
                            </ListGroup>
                        </Col>

                        <Col sm={8}>
                            <div className="App">
                                <h2>Import CSV File!</h2>
                                    <input
                                        className="csv-input"
                                        type="file"
                                        ref={input => {
                                                   this.filesInput = input;
                                                }}
                                        name="studentscsv"
                                        placeholder={null}
                                        onChange={this.handleChange}
                                    />
                                <p />
                                <button onClick={this.importCSV}> Upload now!</button>
                           </div>

                        </Col>
                    </Row>
                </Container>
                     </>
                     }
                </>
              )}
            </AuthContext.Consumer>
            );
        }
}


export default withRouter(SupportOfficePage);
