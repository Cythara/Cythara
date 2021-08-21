import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import FindDuel from "./FindDuel";
import { ThemeProvider, createTheme } from "@material-ui/core";

export default function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/home" component={HomePage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/find-duel" component={FindDuel} />
            </Switch>
        </Router>
    );
}

// <Route path="/leaderboard" component={LeaderBoard} />
const theme = createTheme({
    palette: {
        primary: {
            light: "#000fff",
            main: "rgb(23, 105, 170)",
            dark: "#0000000",
        },
        secondary: {
            main: "#f44336",
        },
    },
});

const appDiv = document.getElementById("app");
render(
    <ThemeProvider theme={theme}>
        {" "}
        <App />{" "}
    </ThemeProvider>,
    appDiv
);

