import React, { useState } from 'react';
import './index.css';
import './style/common.css';
import './style/root.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import NavBar from './components/NavBar';
import { AuthContext } from './context/auth-context';
import TaskList from './pages/TaskList/taskList';
import Network from './pages/network/network';
import Profile from './pages/profile/profile';
import AssignmentList from './pages/TaskList/assignmentList';
import Customize from './pages/customize/customize';
import { adventTheme, darkTheme, lightTheme, materialDark, belugaBlue } from './themes';
import style from './app.module.css';
import Sidebar from './components/Sidebar/sidebar';
import CreateProject from './pages/createProject/createProject';

function App() {
  const [token, setToken] = useState(null);
  const [personId, setPersonId] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(null);
  const [admin, setAdmin] = useState(null);

  let themeVar = localStorage.getItem("theme");
  if (themeVar === null || themeVar == undefined) themeVar = "dark";
  const [theme, setTheme] = useState(themeVar);

  const applyTheme = (theme) => {
    localStorage.setItem("theme", theme)
    let theTheme = darkTheme
    if (theme === "light") theTheme = lightTheme;
    if (theme === "advent") theTheme = adventTheme;
    if (theme === "material") theTheme = materialDark;
    if (theme === "beluga") theTheme = belugaBlue;

    Object.keys(theTheme).map(key => {
      const value = theTheme[key];
      document.documentElement.style.setProperty(key, value);
    });
  };

  applyTheme(theme);

  return (
    <AuthContext.Provider value={{ token, setToken, personId, setPersonId, tokenExpiration, setTokenExpiration, admin, setAdmin }}>
      <Router>
        <Switch>
          <Route exact path="/login"> <Login /> </Route>
          <Route exact path="/signup"> <Signup /> </Route>

          <Route>
            <div className={style.sidebarGrid}>
              <Sidebar />

              <div>
                <Switch>
                  <Route exact path="/network"> <Network /> </Route>
                  <Route exact path="/assignments">  <AssignmentList /> </Route>
                  <Route exact path="/create-project"> <CreateProject /> </Route>
                  <Route path="/profile/"> <Profile /> </Route>
                  <Route path="/customization"> <Customize theme={theme} applyTheme={applyTheme} /> </Route>
                  <Route path="/"> <TaskList /> </Route>
                </Switch>
              </div>
            </div>

          </Route>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
