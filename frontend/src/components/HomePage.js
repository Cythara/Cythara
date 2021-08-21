import React from "react";
import { Link } from "react-router-dom";
import { Grid, Button, Typography, makeStyles } from "@material-ui/core";
import NavigationBar from "./NavigationBar";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
        borderRadius: "30em",
        backgroundColor: theme.palette.secondary.main,
    },

    homeImage: {
        borderRadius: "30em",
        padding: "3em",
        backgroundColor: theme.palette.primary.main,
        width: "13%",
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
                    class={classes.homeImage}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Typography id="home_banner_text">
                    CREATE YOUR MUSIC AND COMPETE WITH OTHERS
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Button className={classes.button} to="/login" component={Link}>
                    GET STARTED
                </Button>
            </Grid>
        </Grid>
    );
}

