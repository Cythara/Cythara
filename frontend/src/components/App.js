import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import FindDuel from "./FindDuel";
import LeaderBoard from "./Leaderboard";
import Duel from "./Duel";
import Votes from "./Votes";
import { ThemeProvider, createTheme, CssBaseline } from "@material-ui/core";

export default function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/home" component={HomePage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/find-duel" component={FindDuel} />
                <Route path="/duel" component={Duel} />
                <Route path="/leaderboard" component={LeaderBoard} />
                <Route path="/voting" component={Votes} />
            </Switch>
        </Router>
    );
}

const theme = createTheme({
    palette: {
        primary: {
            light: "#000fff",
            main: "rgb(23, 105, 170)",
            dark: "#0000000",
        },
        secondary: {
            main: "#c45346",
        },
    },

    typography: {
        fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    },
});

const appDiv = document.getElementById("app");
render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />{" "}
    </ThemeProvider>,
    appDiv
);

