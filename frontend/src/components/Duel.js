import React from "react";
import { useState, useEffect, useRef } from "react";
import { Button, Grid, Typography, makeStyles } from "@material-ui/core";
import getCookie from "./getCookie";
import WaveSurfer from "wavesurfer.js";
import NavigationBar from "./NavigationBar";
import { fade } from "@material-ui/core/styles/colorManipulator";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
        borderRadius: "25em",
        paddingLeft: "1em",
        paddingRight: "1em",
        fontSize: "1.5em",
        backgroundColor: theme.palette.secondary.main,
    },

    wave: {
        backgroundColor: fade(theme.palette.primary.main, 0.2),
        borderRadius: "1em",
    },
}));

export default function Duel(props) {
    const classes = useStyles();

    const waveformRef = useRef(null);
    const waveformDiv = useRef(null);

    const [fileCode, setFileCode] = useState(null);

    const [recordState, setRecordState] = useState(null);

    useEffect(() => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
        };

        fetch("/api/get-backing-track", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                waveformRef.current = WaveSurfer.create({
                    barWidth: 3,
                    cursorWidth: 1,
                    container: waveformDiv.current,
                    backend: "WebAudio",
                    height: 512,
                    barHeight: 3,
                    hideScrollbar: true,
                    scrollParent: true,
                    progressColor: "#2D5BAA",
                    responsive: true,
                    waveColor: "#FF8000",
                });

                setFileCode(data.name);
                waveformRef.current.load(
                    "/media/background/" + data.name + ".wav"
                );
            })
            .then(() => console.log("Track received"));

        return () => waveformRef.current.destroy();
    }, []);

    function recordButtonClicked() {
        setRecordState(RecordState.START);
        waveformRef.current.play();
        setTimeout(() => {
            setRecordState(RecordState.STOP);
        }, 60 * 1000);
    }

    function onStopRecording(audioData) {
        console.log(audioData);
        const formData = new FormData();
        formData.append("audio_file", audioData.blob);
        formData.append("code", fileCode);
        const requestOptions = {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: formData,
        };

        fetch("/api/submit-duel", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                props.history.push("/voting");
            });
    }

    return (
        <Grid container justify="center">
            <Grid item align="center" xs={12}>
                <NavigationBar />
            </Grid>
            <Grid item align="center" xs={12}>
                <Typography component="h1" variant="h3">
                    Get Creating!
                </Typography>
            </Grid>
            <Grid item align="center" xs={12}>
                <Typography>Record over the track below.</Typography>
            </Grid>
            <Grid item align="center" xs={6}>
                <div
                    ref={waveformDiv}
                    align="center"
                    className={classes.wave}
                ></div>
            </Grid>
            <Grid container justify="center" xs={12}>
                <Grid item align="center" xs={6}>
                    <Button
                        className={classes.button}
                        onClick={() => {
                            waveformRef.current.playPause();
                        }}
                        disabled={fileCode === null}
                    >
                        Play/Pause
                    </Button>
                </Grid>
                <Grid item align="center" xs={6}>
                    <Button
                        className={classes.button}
                        onClick={recordButtonClicked}
                        disabled={!(recordState === null) || fileCode === null}
                    >
                        Record
                    </Button>
                </Grid>
                <div style={{ display: "none" }}>
                    <AudioReactRecorder
                        state={recordState}
                        onStop={onStopRecording}
                    />
                </div>
            </Grid>
        </Grid>
    );
}

