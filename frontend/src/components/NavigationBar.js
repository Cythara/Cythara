import React from "react";
import { Grid, Button, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import { fade } from "@material-ui/core/styles/colorManipulator";

const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: fade(theme.palette.primary.main, 0.5),
        margin: theme.spacing(1),
        width: "90%",
        borderRadius: "0.5em",
    },
}));

export default function NavigationBar() {
    const classes = useStyles();
    return (
        <Grid container spacing={1}>
            <Grid item xs>
                <Button component={Link} to="/home" className={classes.button}>
                    Home
                </Button>
            </Grid>
            <Grid item xs>
                <Button
                    component={Link}
                    to="/leaderboard"
                    className={classes.button}
                >
                    LeaderBoard
                </Button>
            </Grid>
            <Grid item xs>
                <Button
                    component={Link}
                    to="/find-duel"
                    className={classes.button}
                >
                    Create
                </Button>
            </Grid>
            <Grid item xs>
                <Button component={Link} to="/login" className={classes.button}>
                    Login
                </Button>
            </Grid>
        </Grid>
    );
}

