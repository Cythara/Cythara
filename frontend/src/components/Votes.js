import React, { useState, useEffect, useRef } from "react";
import { Grid, Button, makeStyles, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { fade } from "@material-ui/core/styles/colorManipulator";
import WaveSurfer from "wavesurfer.js";
import NavigationBar from "./NavigationBar";
import getCookie from "./getCookie";

const useStyles = makeStyles((theme) => ({
    button: {
        borderRadius: "25em",
        backgroundColor: theme.palette.secondary.main,
        width: "75%",
    },

    wave: {
        backgroundColor: fade(theme.palette.primary.main, 0.2),
        borderRadius: "1em",
    },
}));
export default function Votes() {
    const classes = useStyles();

    const [votes1, setVotes1] = useState(0);
    const [votes2, setVotes2] = useState(0);

    const [loaded1, setLoaded1] = useState(false);
    const [loaded2, setLoaded2] = useState(false);

    const [canVote, setCanVote] = useState(true);

    const waveformRef1 = useRef(null);
    const waveformRef2 = useRef(null);

    const waveformDiv1 = useRef(null);
    const waveformDiv2 = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
            };

            fetch("/api/get-votes", requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    setVotes1(data.votes1);
                    setVotes2(data.votes2);
                });
        }, 500);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
            };

            fetch("/api/get-links", requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    if (!loaded1 && data.name1 && !waveformRef1.current) {
                        console.log("line");
                        waveformRef1.current = WaveSurfer.create({
                            barWidth: 3,
                            cursorWidth: 1,
                            container: waveformDiv1.current,
                            backend: "WebAudio",
                            barHeight: 3,
                            height: 400,
                            hideScrollbar: true,
                            scrollParent: true,
                            progressColor: "#2D5BAA",
                            responsive: true,
                            waveColor: "#FF8000",
                        });

                        setLoaded1(true);
                        waveformRef1.current.load(
                            "/media/tracks/" + data.name1 + ".wav"
                        );
                    }

                    if (!loaded2 && data.name2 && !waveformRef2.current) {
                        waveformRef2.current = WaveSurfer.create({
                            barWidth: 3,
                            cursorWidth: 1,
                            container: waveformDiv2.current,
                            backend: "WebAudio",
                            barHeight: 3,
                            height: 400,
                            hideScrollbar: true,
                            scrollParent: true,
                            progressColor: "#2D5BAA",
                            responsive: true,
                            waveColor: "#FF8000",
                        });

                        setLoaded2(true);
                        waveformRef2.current.load(
                            "/media/tracks/" + data.name2 + ".wav"
                        );
                    }

                    if (waveformRef1.current && waveformRef2.current)
                        clearInterval(timer);
                });
        }, 500);

        return () => clearInterval(timer);
    }, []);

    function vote(e) {
        console.log(e);
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({
                player: e,
            }),
        };

        fetch("/api/add-vote-duel", requestOptions)
            .then((response) => response.json())
            .then((data) => console.log(data));

        setCanVote(false);
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <NavigationBar />
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h1" variant="h3">
                    VOTE!
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Grid container>
                    <Grid item xs={12} align="center">
                        <Typography
                            className={classes.title}
                            component="h1"
                            variant="h4"
                        >
                            Player 1
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <div
                            ref={waveformDiv1}
                            align="center"
                            className={classes.wave}
                        ></div>
                        <Typography component="h1" variant="h5">
                            Waiting for Player 1...
                        </Typography>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Button
                            disabled={!loaded1}
                            className={classes.button}
                            onClick={() => {
                                waveformRef1.current.playPause();
                            }}
                        >
                            Play/Pause
                        </Button>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Button
                            disabled={!canVote || !loaded1 || !loaded2}
                            className={classes.button}
                            onClick={() => vote(1)}
                        >
                            Vote
                        </Button>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <Typography> {votes1} Vote(s) </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container>
                    <Grid item xs={12} align="center">
                        <Typography
                            className={classes.title}
                            component="h1"
                            variant="h4"
                        >
                            Player 2
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <div
                            ref={waveformDiv2}
                            align="center"
                            className={classes.wave}
                        ></div>
                        <Typography component="h1" variant="h5">
                            Waiting for Player 2...
                        </Typography>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Button
                            disabled={!loaded2}
                            className={classes.button}
                            onClick={() => {
                                waveformRef2.current.playPause();
                            }}
                        >
                            Play/Pause
                        </Button>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Button
                            disabled={!canVote || !loaded1 || !loaded2}
                            className={classes.button}
                            onClick={() => vote(2)}
                        >
                            Vote
                        </Button>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <Typography> {votes2} Vote(s) </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

