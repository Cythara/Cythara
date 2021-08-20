import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";
/*
class Login extends React.Component -> a class
to log the name entered by the user,
in the "Forms" Field (Line 20).
*/
class Login extends React.Component{
    state = {
        name:""
    }
    handleSubmit = (e) =>{
        const name = e.target;
        this.setState([name])
    }
    render(){
        return(
            <div>
            <form className = "Forms">
                <input type = "name" name = "Name" placeholder = "Enter your Name"required/>
            </form>
            <Link id = "LoginBtn" onClick = {this.handleSubmit} to ="/Welcome">Login</Link>
        </div>
        )
    }
}
export default Login;