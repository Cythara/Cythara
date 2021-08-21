import {
    Grid,
    Typography,
    Button,
    makeStyles,
    MenuItem,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import React, { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import getCookie from "./getCookie";
import Menu from "@material-ui/core/Menu";

const useStyles = makeStyles((theme) => ({
    swords: {
        width: "13%",
    },
}));

export default function FindDuel() {
    const classes = useStyles();

    const [joinRoomDialogOpen, setJoinRoomDialogOpen] = useState(false);
    const [existingRoomCode, setExistingRoomCode] = useState("");
    const [joinAsAudience, setJoinAsAudience] = useState("");

    const [createRoomDialogOpen, setCreateRoomDialogOpen] = useState(false);
    const [createDuelGenre, setCreateDuelGenre] = useState("Select Genre");

    const [anchorEl, setAnchorEl] = useState(null);
    const [genreList, setGenreList] = useState([]);

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
        };

        fetch("/api/list-genres", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                let list = [];
                for (const genre of data) {
                    list = [...list, genre.genre_name];
                }
                setGenreList(list);
            });
    }, []);

    useEffect(() => {
        console.log(genreList);
    }, [genreList]);

    function createNewRoom() {
        setCreateRoomDialogOpen(false);

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({
                genre: createDuelGenre,
            }),
        };

        fetch("/api/create-duel", requestOptions)
            .then((response) => response.json())
            .then((data) => console.log(data));
    }

    function joinExistingRoom() {
        setJoinRoomDialogOpen(false);

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({
                code: existingRoomCode,
                play: !joinAsAudience,
            }),
        };

        fetch("/api/join-duel", requestOptions)
            .then((response) => response.json())
            .then((data) => console.log(data));
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <NavigationBar />
            </Grid>
            <Grid item xs={12} align="center">
                <img
                    src="/static/images/swords_img.png"
                    alt="2 Swords"
                    size="50%"
                    class={classes.swords}
                />
            </Grid>

            <Grid item align="center" xs={12}>
                <Typography>Get Ready To Duel!</Typography>
            </Grid>

            <Grid container item xs={12} spacing={2} align="center">
                <Grid item xs align="center">
                    <Button onClick={(e) => setCreateRoomDialogOpen(true)}>
                        Create Duel
                    </Button>
                    <Dialog
                        open={createRoomDialogOpen}
                        onClose={() => setCreateRoomDialogOpen(false)}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle>Create Duel</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Select a genre to create a new duel.
                            </DialogContentText>
                            <Button
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                            >
                                {createDuelGenre}
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                            >
                                {genreList.map((genre) => (
                                    <MenuItem
                                        onClick={(e) => {
                                            setCreateDuelGenre(genre);
                                            setAnchorEl(null);
                                        }}
                                    >
                                        {genre}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setCreateRoomDialogOpen(false)}
                                color="primary"
                            >
                                Cancel
                            </Button>
                            <Button onClick={createNewRoom} color="primary">
                                Create
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>

                <Grid item xs align="center">
                    <Button onClick={() => setJoinRoomDialogOpen(true)}>
                        Join Duel
                    </Button>
                    <Dialog
                        open={joinRoomDialogOpen}
                        onClose={() => setJoinRoomDialogOpen(false)}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle>Join Duel</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To join an existing duel, use the six digit room
                                code provided to the creator.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                label="Duel code"
                                fullWidth
                                onChange={(e) =>
                                    setExistingRoomCode(e.target.value)
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={joinAsAudience}
                                        onChange={(e) =>
                                            setJoinAsAudience(e.target.checked)
                                        }
                                        name="player"
                                        color="primary"
                                    />
                                }
                                label="Join as audience?"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setJoinRoomDialogOpen(false)}
                                color="primary"
                            >
                                Cancel
                            </Button>
                            <Button onClick={joinExistingRoom} color="primary">
                                Join
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
        </Grid>
    );
}

