import React from "react";
import "../css/styles.css";

/*
const LeaderBoard -> contains an Arrow Function,
that returns a "Leaderboard" table (Line 11),
to the HTML.
*/
const LeaderBoard = () =>{
    return(
       <div>
           <p>Leaderboard</p>
           <table className = "Leaderboard">
               <tr>
                   Name
                   Points
               </tr>
           </table>
       </div>
    );
}

export default LeaderBoard;