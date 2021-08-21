import React from "react";
import { Grid, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function NavigationBar() {
    return (
        <Grid container spacing={3}>
            <Grid item xs>
                <Button component={Link} to="/home">
                    Home
                </Button>
            </Grid>
            <Grid item xs>
                <Button component={Link} to="/home">
                    LeaderBoard
                </Button>
            </Grid>
            <Grid item xs>
                <Button component={Link} to="/find-duel">
                    Create
                </Button>
            </Grid>
            <Grid item xs>
                <Button component={Link} to="/login">
                    Login
                </Button>
            </Grid>
        </Grid>
    );
}

