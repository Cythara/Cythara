import React from "react";
import userimg from "../images/userimg.png";
import {Link} from "react-router-dom";
import "../css/styles.css";

function trialFunction() {
    console.log("Vote has been casted!")
}

const AudiencePage = () =>{
    return(
        <div>
            <img className = "UserPlaceHolder1" src = {userimg} alt = "User1"/>
            <br/>
            <img src = {userimg} alt = "UserPlaceHolder2" src = {userimg} alt = "User2"/>
            <view className = "VerticalLine"></view>
            <br/>
            <br/>
            <p className = "LinksType1">User1</p>
            <p className = "LinksType1">User2</p>
            <br/>
            <br/>
            <Link onClick = {trialFunction} className = "LinksType1" to = "/VotesBoard">Vote!</Link>
            <Link onClick = {trialFunction} className = "LinksType1" to = "/VotesBoard">Vote!</Link>
        </div>
    )
}

export default AudiencePage;