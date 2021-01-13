import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import API from './API/API.js';
import { AuthContext } from './auth/AuthContext';
import BookingManagerPage from './components/bookingManager/BookingManagerPage';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import StudentPage from './components/student/StudentPage';
import SupportOfficerPage from './components/supportOfficer/SupportOfficerPage';
import TeacherPage from './components/teacher/TeacherPage';
import User from './entities/User';
import './style/App.css';
 

function App() {
    return (
        <div className="App">
            <Router>
                <PULSeBSApp />
            </Router>
        </div>
    )
}

class PULSeBSApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};


        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        API.isAuthenticated().then(
            (user) => {
                this.setState({ authUser: user });
            }
        ).catch((err) => {
            this.setState({ authErr: err });
        });


    }

    logout = () => {
        API.logout().then(() => {
            this.setState({ authUser: null, authErr: null });
            //this.props.history.push("/");
        });
    }

    login = (email, password) => {

        API.login(email, password).then((user) => {
            //this.setFullName(user.id, user.name, user.surname, user.type);
            this.setState({
                authUser: new User(user.id, user.name, user.surname, user.type),
                authErr: null
            });

        }).catch((err) => {
            console.log(err);
            this.setState({ authErr: err });
        });

    }



    render() {
        return <>
            <AuthContext.Provider value={{ authUser: this.state.authUser, authErr: this.state.authErr, loginUser: this.login, logoutUser: this.logout }}>
                <Header />
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
                        <Route path='/manager'>
                            <BookingManagerPage />
                        </Route>
                        <Route path='/supportOffice'>
                            <SupportOfficerPage />
                        </Route>
                        <Route exact path='/'>
                            <Redirect to='Login' />
                        </Route>
                    </Switch>
                </Router>
            </AuthContext.Provider>
        </>;
    }
}

export default App;
