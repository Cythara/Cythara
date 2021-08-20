import './App.css';
import HomePage from "./components/pages/Home";
import CreateMusic from "./components/pages/CreateMusic";
import LeaderBoard from "./components/pages/LeaderBoard";
import LoginPage from "./components/pages/Login";
import WelcomePage from "./components/pages/WelcomePage";
import CreateDuel from "./components/pages/CreateDuel";
import JoinDuel from "./components/pages/JoinDuel";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";


/*
function App() -> implements the different Routes,
using BrowserRouter,Route and Switch (Line 9).
*/
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path = "/" component = {HomePage} />
        <Route exact path = "/Home" component = {HomePage}/>
        <Route exact path = "/CreateMusic" component = {CreateMusic}/>
        <Route exact path = "/LeaderBoard" component = {LeaderBoard}/>
        <Route exact path = "/Login" component = {LoginPage}/>
        <Route exact path = "/Welcome" component = {WelcomePage}/>
        <Route exact path = "/CreateDuel" component = {CreateDuel}/>
        <Route exact path = "/JoinDuel" component = {JoinDuel}/>
        
      </Switch>
    </Router>
  );
}

export default App;
