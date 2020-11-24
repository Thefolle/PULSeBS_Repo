import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router-dom';

import User from './User';
import LoginPage                   from './login';
import StudentPage                 from './studentPage';
import TeacherPage   from './Components/TeacherPage';
import Header from './Components/Header';
import Footer from './Components/Footer';

import './App.css';

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
        this.state = {user: undefined};
        this.setFullName = this.setFullName.bind( this );
    }

    // called by LoginPage, this method sets the fullname of the user at this level; it may be useful for presentation
    // purposes
    setFullName( id, name, surname, type ) {
        this.setState({user: new User(id, name, surname, type) });
    }


    render() {
        return <>
           <Header user={this.state.user}/>
            <Router>
                <Switch>
                        <Route exact path='/Login'>
                            <LoginPage setFullName={ this.setFullName }/>
                        </Route>
                        <Route path='/StudentHome' >
                         <StudentPage user={this.state.user} />
                        </Route>
                        <Route path='/teacher'>
                            <TeacherPage id={ this.state.id } user={this.state.user} name={ this.state.name } surname={ this.state.surname }/>
                        </Route>
                        <Route exact path='/'>
                            <Redirect to='Login'/>
                        </Route>
                </Switch>
            </Router>
            <Footer/>
        </>;
    }
}

export default App;
