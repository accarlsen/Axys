import React, {useState} from 'react';
import './index.css';
import './style/common.css';
import './style/root.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import NavBar from './components/NavBar';
import {AuthContext} from './context/auth-context';
import TaskList from './pages/TaskList/taskList';
import Network from './pages/network/network';
import Profile from './pages/profile/profile';
import AssignmentList from './pages/TaskList/assignmentList';

function App() {
  const [token, setToken] = useState(null);
  const [personId, setPersonId] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(null);
  const [admin, setAdmin] = useState(null);


  return (
    <AuthContext.Provider value={{ token, setToken, personId, setPersonId, tokenExpiration, setTokenExpiration, admin, setAdmin}}>
      <Router>
        <Switch>
          <Route exact path="/login">
            <NavBar />
            <Login />
          </Route>
          <Route exact path="/signup">
            <NavBar />
            <Signup />
          </Route>
          <Route exact path="/network">
            <NavBar />
            <Network />
          </Route>
          <Route exact path="/assignments">
            <NavBar />
            <AssignmentList />
          </Route>
          <Route path="/profile/">
            <NavBar />
            <Profile />
          </Route>
          <Route path="/">
            <NavBar />
            <TaskList />
          </Route>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
