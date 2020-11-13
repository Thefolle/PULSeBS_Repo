import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Redirect from 'react-router-dom/Redirect';
import LoginPage from './login';

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
  constructor(props) {
    super(props);
    this.state = { name: '', surname: '', type: undefined };
    this.setFullName = this.setFullName.bind(this);
  }

  // called by LoginPage, this method sets the fullname of the user at this level; it may be useful for presentation purposes
  setFullName(name, surname, type) {
    this.setState({ name: name, surname: surname, type: type });
  }

  render() {
    return <>
      <Switch>
        <Route exact path='/Login'>
          <LoginPage setFullName={this.setFullName} ></LoginPage>
        </Route>
        <Route exact path='/StudentHome' >
          {/* <StudentPage /> */}
        </Route>
        <Route exact path='/TeacherHome'>
          {/* <TeacherPage /> */}
        </Route>
        <Route exact path='/'>
          <Redirect to='Login' />
        </Route>
      </Switch>
    </>;
  }
}

export default App;
