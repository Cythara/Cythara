import React from "react";
import swords from "../images/swords.png";
import "../css/styles.css";
import {Link} from "react-router-dom";

/*
const CreateMusic -> contains an Arrow Function,
that returns 3 "LinksType1" Links (Lines 13,16,17),
a "Swords" img,
and a "Text_Home" paragraph,
to the HTML.
*/
const CreateMusic = () =>{
    return(
        <div>
            <Link className = "LinksType1" to = "/LeaderBoard">LeaderBoard</Link>
            <img className = "Swords" src = {swords} alt = "2 Swords"/>
            <p className = "TextType1">Get Ready To Duel!</p>
            <Link className = "LinksType1" to = "/CreateDuel">Create Duel</Link>
            <Link className = "LinksType1" to = "/JoinDuel">Join Duel</Link>

        </div>
    )
}

export default CreateMusic;