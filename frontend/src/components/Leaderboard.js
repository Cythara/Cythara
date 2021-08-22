import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import NavigationBar from "./NavigationBar";
import getCookie from "./getCookie";
import { Grid, Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { fade } from "@material-ui/core/styles/colorManipulator";

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },

    cell: {
        fontSize: "2em",
        color: "white",
        backgroundColor: fade("#003366", 0.7),
    },
}));

export default function LeaderBoard() {
    const classes = useStyles();

    const [users, setUsers] = useState([]);

    function fetchLeaderboard() {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
        };

        fetch("/api/leaderboard", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);
                console.log(data);
            });
    }

    useEffect(() => {
        fetchLeaderboard();
        const timer = setInterval(fetchLeaderboard, 30000);
        return () => clearInterval(timer);
    }, []);

    return (
        <Grid container justifyContent="flex-start" alignItems="flex-start">
            <Grid item align="center" xs={12}>
                <NavigationBar />
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h1" variant="h3">
                    Leaderboard
                </Typography>
            </Grid>

            <Grid item xs={12} align="center">
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.cell}>
                                {"#"}
                            </TableCell>
                            <TableCell className={classes.cell} align="center">
                                Username
                            </TableCell>
                            <TableCell className={classes.cell} align="right">
                                Score
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow>
                                <TableCell className={classes.cell}>
                                    {index + 1}
                                </TableCell>
                                <TableCell
                                    className={classes.cell}
                                    align="center"
                                >
                                    {user.username}
                                </TableCell>
                                <TableCell
                                    className={classes.cell}
                                    align="right"
                                >
                                    {user.user_score}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Grid>
        </Grid>
    );
}

