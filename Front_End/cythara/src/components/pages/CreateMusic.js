import React from "react";
import swords from "../images/swords.png";
import "../styles.css";
import {Link} from "react-router-dom";

/*
const CreateMusic -> contains an Arrow Function,
that returns 3 "TopBarButtons" Links (Lines 13,16,17),
a "Swords" img,
and a "Text_Home" paragraph,
to the HTML.
*/
const CreateMusic = () =>{
    return(
        <div>
            <Link className = "TopBarButtons" to = "/LeaderBoard">LeaderBoard</Link>
            <img className = "Swords" src = {swords} alt = "2 Swords"/>
            <p className = "Text_Home">Get Ready To Duel!</p>
            <Link className = "TopBarButtons" to = "/CreateDuel">Create Duel</Link>
            <Link className = "TopBarButtons" to = "/JoinDuel">Join Duel</Link>

        </div>
    )
}

export default CreateMusic;