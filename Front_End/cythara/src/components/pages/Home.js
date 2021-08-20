import React from "react";
import "../styles.css";
import mic from "../images/Mic_Image_Home.jpg";
import { Link } from "react-router-dom";

/*
const HomePage -> contains an Arrow Function,
that returns 2 "TopBarButtons" Links (Lines 15,16),
an img(alt = "Mic") (Line 17),
and a "Text_Home" Paragraph (Line 20),
to the HTML.
*/

const HomePage = () =>{
    return(
        <div>
            <Link className = "TopBarButtons" to = "/Home">Home</Link>
            <Link className = "TopBarButtons" to = "/Login">Login</Link>
            <img src = {mic} alt = "Mic"/>
            <p id = "Text_Home">Create Your Music And Compete With Others!</p>
            
        </div>
    )
}

export default HomePage;