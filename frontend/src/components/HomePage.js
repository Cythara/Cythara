import React from "react";
import { Link } from "react-router-dom";
import { Grid, Button, Typography, makeStyles } from "@material-ui/core";
import NavigationBar from "./NavigationBar";
import { fade } from "@material-ui/core/styles/colorManipulator";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
        borderRadius: "25em",
        paddingLeft: "1em",
        paddingRight: "1em",
        fontSize: "2em",
        backgroundColor: theme.palette.secondary.main,
    },

    homeImage: {
        borderRadius: "30em",
        padding: "3em",
        backgroundColor: fade(theme.palette.primary.main, 0.7),
        width: "13%",
    },

    bannerText: {
        fontWeight: "800",
        fontSize: "3em",
        color: theme.palette.primary.dark,
    },
}));

export default function HomePage() {
    const classes = useStyles();

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <NavigationBar />
            </Grid>

            <Grid item xs={12} align="center">
                <img
                    src="/static/images/home_mic.png"
                    alt="Mic Image"
                    className={classes.homeImage}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h1" className={classes.bannerText}>
                    CREATE YOUR MUSIC AND COMPETE WITH OTHERS
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Button className={classes.button} to="/login" component={Link}>
                    GET STARTED!
                </Button>
            </Grid>
        </Grid>
    );
}

