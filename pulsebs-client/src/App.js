import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router-dom';
import LoginPage                   from './login';
import StudentPage                 from './studentPage';


import TeacherPage   from './Components/TeacherPage';

import './App.css';
import { Container } from "react-bootstrap";

function App() {
    return (
        <div className="App">
            <Router>
                <PULSeBSApp></PULSeBSApp>
            </Router>
        </div>
    )
}

class PULSeBSApp extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {id: '', name: '', surname: '', type: undefined};
        this.setFullName = this.setFullName.bind( this );
    }

    // called by LoginPage, this method sets the fullname of the user at this level; it may be useful for presentation
    // purposes
    setFullName( id, name, surname, type ) {
        this.setState( {id: id, name: name, surname: surname, type: type} );
    }


    render() {
        return <>
            <Router>
                <Switch>
                    <Container fluid={ "xl" }>
                        <Route exact path='/Login'>
                            <LoginPage setFullName={ this.setFullName }/>
                        </Route>
                        <Route path='/StudentHome' component={ StudentPage }>
                            {/* <StudentPage /> */ }
                            {/* <StudentPage authUser={this.state.authUser} name={this.state.name} surname={this.state.surname} /> */ }
                        </Route>
                        <Route path='/teacher'>
                            <TeacherPage id={ this.state.id } name={ this.state.name } surname={ this.state.surname }/>
                        </Route>
                        <Route exact path='/'>
                            <Redirect to='Login'/>
                        </Route>
                    </Container>
                </Switch>
            </Router>
        </>;
    }
}

export default App;
