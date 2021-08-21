import React from "react";
import "../css/styles.css";
import mic from "../images/Mic_Image_Home.jpg";
import { Link } from "react-router-dom";

/*
const HomePage -> contains an Arrow Function,
that returns 2 "LinksType1" Links (Lines 15,16),
an img(alt = "Mic") (Line 17),
and a "TextType1" Paragraph (Line 20),
to the HTML.
*/

const HomePage = () =>{
    return(
        <div>
            <Link className = "LinksType1" id = "HomeBtn" to = "/Home">Home</Link>
            <Link className = "LinksType1" id = "LoginBtnHome" to = "/Login">Login</Link>
            <img id = "MicImg"src = {mic} alt = "Mic"/>
            <p id = "TextType1">Create Your Music And Compete With Others!</p>
            
        </div>
    )
}

export default HomePage;