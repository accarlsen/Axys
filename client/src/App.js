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
    "--background": "#f9f9f9",
    "--background2": "#FFF",
    "--background3": "#f2f2f2",
    "--shadow": "#b8b8b8",
    "--shadow-highlight": "#969696",
    "--text": "#000",
    "--text-off": "#272727",
    "--text-off2": "#2A2A2A",
    "--text-inverted": "#FFF",
    "--grey": "rgb(248, 248, 248)",
    "--greyer": "rgb(230, 230, 230)",
    "--grey-dark": "rgb(133, 133, 133)",

    "--blue-link": "#e0e0e0",
    "--green": "#4ff4a2",
    "--greenlight": "#22cf79",
    "--green-dark": "#7feeb6",
    "--red": "#f7532b",
    "--red-light": "rgb(206, 76, 44)",
    "--blue": "#52b8e7",

    "--p-weight": "400",

    "--greyGradient": "linear-gradient(to right, rgb(248, 248, 248), var(--background2))",
    "--greyerGradient": "linear-gradient(to right, rgb(230, 230, 230), var(--grey))",
  };
  
  const darkTheme = {
    "--background": "#1b1b1b",
    "--background2": "#222",
    "--background3": "#1d1d1d",
    "--shadow": "#b8b8b800",
    "--shadow-highlight": "#96969600",
    "--text": "#FFF",
    "--text-off": "#e0e0e0",
    "--text-off2": "#bbbbbb",
    "--text-inverted": "#000",
    "--grey": "rgb(49, 49, 49)",
    "--greyer": "rgb(90, 90, 90)",
    "--grey-dark": "rgb(153, 153, 153)",

    "--blue-link": "#e0e0e0",
    "--green": "#4ff4a2",
    "--greenlight": "#22cf79",
    "--green-dark": "#7feeb6",
    "--red": "#f7532b",
    "--red-light": "rgb(206, 76, 44)",
    "--blue": "#52b8e7",

    "--p-weight": "300",

    "--greyGradient": "linear-gradient(to right, rgb(48, 48, 48), var(--background2))",
    "--greyerGradient": "linear-gradient(to right, rgb(59, 59, 59), var(--grey))",
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
