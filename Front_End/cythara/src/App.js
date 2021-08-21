import './App.css';
import HomePage from "./components/pages/Home";
import CreateMusic from "./components/pages/CreateMusic";
import LeaderBoard from "./components/pages/LeaderBoard";
import LoginPage from "./components/pages/Login";
import WelcomePage from "./components/pages/WelcomePage";
import CreateDuel from "./components/pages/CreateDuel";
import JoinDuel from "./components/pages/JoinDuel";
import DuelScreen from './components/pages/DuelScreen';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import GenerateMusic from './components/pages/GenerateMusic';
import RecordMusic from './components/pages/RecordMusic';
import AudiencePage from './components/pages/AudiencePage';
import VotesBoard from './components/pages/VotesBoard';



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
        <Route exact path = "/DuelScreen" component = {DuelScreen}/>
        <Route exact path = "/GenerateMusic" component = {GenerateMusic}/>
        <Route exact path = "/RecordMusic" component = {RecordMusic}/>
        <Route exact path = "/AudiencePage" component = {AudiencePage}/>
        <Route exact path = "/VotesBoard" component = {VotesBoard}/>
      </Switch>
    </Router>
  );
}

export default App;
