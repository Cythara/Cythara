import React from "react";
import { Link } from "react-router-dom";
import "../css/styles.css";
/*
class Login extends React.Component -> a class
to log the name entered by the user,
in the "Forms" Field (Line 20).
*/
class Login extends React.Component{
    state = {
        name:"",
        email:"",
        password:""
    }
    handleSubmit = (e) =>{
        const name = e.target;
        this.setState([name])
    }
    render(){
        return(
            <div>
        
            <input className = "Forms" type = "name" name = "Name" placeholder = "Enter your Username"required/>
            <br/>
            <input className = "Forms" type = "email" name = "Email" placeholder = "Enter your Email"required/>
            <br/>
            <input className = "Forms" type = "password" name = "Password" placeholder = "Enter your Password"required/>
            <br/>
            <Link id = "LoginBtn" onClick = {this.handleSubmit} to ="/Welcome">Login</Link>
        </div>
        )
    }
}
export default Login;