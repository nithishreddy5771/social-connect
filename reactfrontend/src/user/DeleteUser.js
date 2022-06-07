import React, {Component} from 'react';
import {isAuthenticated} from "../auth";
import {remove} from './apiUser';
import {signout} from "../auth";
import {Redirect} from "react-router-dom";

class DeleteUser extends Component {

    state= {
            redirectToHome: false, // we just need  one variable to save redirect
            redirectToAdminProfilePage: false
    }; // end of state

    deleteAccount= () => {
        //console.log("deleting account");
        const token= isAuthenticated().token;
        const userId= this.props.userId;//userId passed from Profile.js while invoking DeleteUser component
        remove(userId, token)
            .then(data => {
                //console.log("inside DeleteUser line 22 isAuthenticated().user.role:", isAuthenticated().user.role);
                //console.log("inside DeleteUser line 22 isAuthenticated().user._id:", isAuthenticated().user._id, userId);
                if(data.error)
                    console.log(data.error);
                //if admin is deleting && not deleting himself then no need to signout
                else if(isAuthenticated().user.role === "admin" && isAuthenticated().user._id !== userId)
                    this.setState({redirectToAdminProfilePage: true});
                else
                {
                    //signout method takes function as argument--see next function in the signout declaration
                    signout(() => console.log("user profile deleted"));
                    //redirect
                    this.setState({redirectToHome: true});
                }
            })
    }; // end of deleteAccount method

    deleteConfirmed= () => {
        let answer= window.confirm("Are you sure you want to delete your account ?");
        if(answer)
            this.deleteAccount(); //call to backend api to delete user

    };// end of deleteConfirmed method

    render() {
        if(this.state.redirectToHome) // redirect to home page
            return <Redirect to="/" />
        if(this.state.redirectToAdminProfilePage)
            return <Redirect to="/admin" />
        return (
            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger">
                Delete Profile
            </button>
        );
    }
}

export default DeleteUser;