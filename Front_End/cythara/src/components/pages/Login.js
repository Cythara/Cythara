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
        password:"",
        entered:false
    }
    handleSubmit = (e) =>{
        const name = e.target;
        this.setState([name])
        this.entered = true
    }
    render(){
        return(
            <div>
            <form className = "Forms">
                <input type = "name" name = "Name" placeholder = "Enter your Username"required/>
                <br/>
                <input type = "password" name = "Password" required/>
                <br/>
                
            </form>
            <Link id = "LoginBtn" onClick = {this.handleSubmit} to ="/Welcome">Login</Link>
        </div>
        )
    }
}
export default Login;