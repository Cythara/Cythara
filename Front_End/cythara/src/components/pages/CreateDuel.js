import React from "react";
function trialFunction(){
    console.log("Duel Code Generated : UVWX");
}
/*
trailFunction() -> Dummy Function[to be replaced by function(s) that implement(s) the HTTP reponse/requests]
CreateDuel() -> contains an Arrow Function,
that returns a button (Line 13) to the HTML.
*/
const CreateDuel = () =>{
    return(
        <div>
            <button onClick = {trialFunction}>Generate Duel Code</button>
        </div>
    )
}

export default CreateDuel;