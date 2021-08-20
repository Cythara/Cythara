import React from "react";
import "../styles.css";

/*
class JoinDuel extends React.Component -> a class,
to log the input duelCode, 
from the user and update it on the SQL database.
*/
class JoinDuel extends React.Component{
    state = {
        duelCode : ""
    }
    handleSubmit(e){
        const userCode = e.target;
        this.setState([userCode]);
        console.log("Duel Code recieved");
    }
    render(){
        return(
            <div>
                <form className = "Forms" onSubmit = {this.handleSubmit}>
                    <input type = "text" name = "RoomCode" id = "RoomCodeField" placeholder = "Enter the Duel Code"></input>
                </form>
            </div>
        )
    }
}

export default JoinDuel;