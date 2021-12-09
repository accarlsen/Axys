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
import Customize from './pages/customize/customize';

function App() {
  const [token, setToken] = useState(null);
  const [personId, setPersonId] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [theme, setTheme] = useState("darkTheme");

  const lightTheme = {
    "--background": "white",
    "--background2": "grey",
    "--background3": "white",
  };
  const darkTheme = {
    "--background": "#1b1b1b",
    "--background2": "#222",
    "--background3": "#1d1d1d",
  };

  const toggleTheme = () => {
    if (theme === "dark") setTheme("light")
    else setTheme("dark")
    applyTheme(theme)
  }

  const applyTheme = theme => {
    const theTheme = theme === "dark" ? lightTheme : darkTheme;
    Object.keys(theTheme).map(key => {
      const value = theTheme[key];
      document.documentElement.style.setProperty(key, value);
    });
  };


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
          <Route path="/customization">
            <NavBar />
            <Customize theme={theme} toggleTheme={toggleTheme} />
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
