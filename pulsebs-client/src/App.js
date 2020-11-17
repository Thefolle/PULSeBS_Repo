import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import {Switch,Route,Redirect} from 'react-router-dom';
import LoginPage from './login';


import TeacherPage from './Components/TeacherPage';

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
    this.state = { name: '', surname: '', type: undefined,id:''};
    this.setFullName = this.setFullName.bind(this);
  }

  // called by LoginPage, this method sets the fullname of the user at this level; it may be useful for presentation purposes
  setFullName(name, surname, type,id) {
    this.setState({ name: name, surname: surname, type: type, id: id});
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
        <Route path='/teacher'>
          <TeacherPage id={this.state.id} name={this.state.name} surname={this.state.surname}/>
          </Route>
        <Route exact path='/'>
          <Redirect to='Login' />
        </Route>
      </Switch>
    </>;
  }
}

export default App;