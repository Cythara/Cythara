import React from "react";
import audio from "../music/twinkle_twinkle.mid"
const GenerateMusic = () =>{
    return(
        <div>
           <audio controls src = {audio}>Your Browser Doesnt Support the Audio Element</audio>
        </div>
    )
}
export default GenerateMusic;