import React from 'react';
import {Route} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import UserNavBar from './Components/UserNavBar';

import './App.css';
import API from './API/API';

import {Switch} from 'react-router-dom';
import {AuthContext} from './auth/AuthContext';
import { Row, Col, Container, ListGroup} from "react-bootstrap";

class SupportOfficePage extends React.Component {

    constructor() {
        super();
        this.state = {
          csvfile: undefined
        };
        this.updateData = this.updateStudentsData.bind(this);
      }
    
      handleChange = event => {
        this.setState({
          csvfile: event.target.files[0]
        });
      };
    
      importStudentsCSV = () => {
        const { csvfile } = this.state;
        Papa.parse(csvfile, {
          complete: this.updateStudentsData,
          header: true
        });
      };
    
      updateStudentsData(result) {
        var data = result.data.map(e => ({id: e.Id, name: e.Name, city: e.City, email: e.OfficialEmail, bday: e.Birthday, ssn: e.SSN}));
        console.log(data);
        API.importStudents(data)

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
                                        name="file"
                                        placeholder={null}
                                        onChange={this.handleChange}
                                    />
                                <p />
                                <button onClick={this.importCSV}> Upload now!</button>
                                {//add check to select kind of data}
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
