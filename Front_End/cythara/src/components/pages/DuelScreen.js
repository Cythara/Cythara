import React from "react";
import "../css/styles.css";
import userimg from "../images/userimg.png";
import {Link} from "react-router-dom";

class DuelScreen extends React.Component{
    state = {
        minutes : 15,
        seconds : 0
    }

    componentDidMount(){
        this.myInterval = setInterval(() =>{
            const {seconds,minutes} = this.state

            if(seconds > 0){
                this.setState(({seconds}) => ({
                    seconds : seconds - 1
                }))
            }

            if(seconds === 0){
                if(minutes === 0){
                    clearInterval(this.myInterval)
                }
                else{
                    this.setState(({minutes}) => ({
                        minutes: minutes - 1,
                        seconds: 59
                    }))
                }
            }
        },1000)
    }
    componentWillUnmount(){
        clearInterval(this.myInterval)
    }
    render(){
        const{minutes,seconds} = this.state;
        return(
            <div>

            {minutes === 0 && seconds === 0 
            ? <h1 className = "LinksType1">Time Up!</h1>
            : <h1 className = "LinksType1">{minutes}
            :{seconds < 10 ? `0${seconds}`:seconds}</h1>
            }

            <img src = {userimg} alt = "User"/>

            <Link id = "GenerateMusicTab"
            className = "LinksType1" 
            to = {minutes === 0 && seconds === 0 ? "":"/GenerateMusic"}
            hidden = {minutes === 0 && seconds === 0 ? true : false} 
            target = "_blank">Generate AI Music
            </Link>

            <Link id = "RecordMusicTab"
            className = "LinksType1"
            to = {minutes === 0 && seconds === 0 ? "":"/RecordMusic"}
            hidden = {minutes === 0 && seconds === 0 ? true : false}
            target = "_blank">RecordMusic
            </Link>
            </div>
        )
    }
}
export default DuelScreen;