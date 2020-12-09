import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router-dom';

import User from './User';
import LoginPage                   from './login';
import StudentPage                 from './studentPage';
import TeacherPage   from './Components/TeacherPage';
import SupportOfficePage from './Components/SupportOfficePage'
import { AuthContext } from './auth/AuthContext';
import Header from './Components/Header';

import './App.css';
import API from './API/API.js';

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
        this.state = {};

    }

    componentDidMount() {
        API.isAuthenticated().then(
            (user) => {
                this.setState({authUser: user});
            }
        ).catch((err) => {
            this.setState({authErr: err});
        });


    }

    logout = () => {
    API.logout().then(() => {
      this.setState({authUser: null,authErr: null});
      //this.props.history.push("/");
    });
  }

   login=(email,password)=> {

      API.login(email,password).then((user) => {
        //this.setFullName(user.id, user.name, user.surname, user.type);
        this.setState({authUser: new User(user.id, user.name, user.surname, user.type),authErr:null });

      }).catch((err) => {
        console.log(err);
        this.setState({ authErr:err});
      });

    }



    render() {
        return <>
        <AuthContext.Provider value={{authUser: this.state.authUser, authErr: this.state.authErr,loginUser: this.login,logoutUser: this.logout}}>
           <Header/>
            <Router>
                <Switch>
                        <Route exact path='/Login'>
                            <LoginPage />
                        </Route>
                        <Route path='/student'>
                         <StudentPage />
                        </Route>
                        <Route path='/teacher'>
                            <TeacherPage />
                        </Route>
                        <Route path='/supportOffice'>
                            <SupportOfficePage />
                        </Route>
                        <Route exact path='/'>
                            <Redirect to='Login'/>
                        </Route>
                </Switch>
            </Router>
          </AuthContext.Provider>
        </>;
    }
}

export default App;
