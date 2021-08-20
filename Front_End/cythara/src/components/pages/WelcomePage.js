import React from "react";
import "../styles.css";
import mic from "../images/Mic_Image_Home.jpg";
import {Link} from "react-router-dom";

/*
const WelcomePage -> contains an Arrow Function,
that returns 3 "TopBarButtons" Links (Lines 13,14,15),
and an img(alt = "Mic") (Line 17),
to the HTML.
*/
const WelcomePage = () =>{
    return(
        <div>
            <Link className = "TopBarButtons" to = "/Welcome">Home</Link>
            <Link className = "TopBarButtons" to = "/CreateMusic">Create Music</Link>
            <Link className = "TopBarButtons" to = "/LeaderBoard">Leaderboard</Link>
            <img src = {mic} alt = "Mic"/>

            <p id = "Text_Home">Create Your Music And Compete With Others!</p>
        </div>
    )
}

export default WelcomePage;