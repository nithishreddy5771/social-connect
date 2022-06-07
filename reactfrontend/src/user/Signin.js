
import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {signin, authenticate} from '../auth';
import SocialLogin from "./SocialLogin";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001",{ transports: ['websocket', 'polling', 'flashsocket']});

class Signin extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectTo: false, // to redirect to other page after login
            loading: false,
            recaptcha: false
        };
    } // end of constructor
    //curried function -- on calling function with one parameter name it will return another function
    // which requires event as input and sets the state
    handleChange = name => event => {
        this.setState({error: ""});
        this.setState({open: false}); //to deactivate the div element once user starts signin again
        this.setState({[name]: event.target.value});
    };

    recaptchaHandler = event => {
        this.setState({ error: "" });
        let userDay = event.target.value.toLowerCase();
        console.log("inside recaptchaHandler method", userDay);
        let dayCount;
        if (userDay === "sunday")
            dayCount = 0;
        else if (userDay === "monday")
            dayCount = 1;
        else if (userDay === "tuesday")
            dayCount = 2;
        else if (userDay === "wednesday")
            dayCount = 3;
        else if (userDay === "thursday")
            dayCount = 4;
        else if (userDay === "friday")
            dayCount = 5;
        else if (userDay === "saturday")
            dayCount = 6;

        if (dayCount === (new Date().getDay()+2)%7 )
        {
            this.setState({ recaptcha: true });
            return true;
        }
        else
        {
            this.setState({
                recaptcha: false
            });
            return false;
        }
    }; //end of recaptchaHandler method

    //onClickSubmit will get an event upon clicking
    onClickSubmit = event => {
        //preventing default behaviour of the browser. i.e reloading on click
        event.preventDefault();
        this.setState({loading: true}); // when the submit button is clicked, loading page activate
        const { email, password} = this.state;//we can't send this.state directly as it contains other fields
        const user = {
            email,
            password
        };
        //console.log(user);
        //if captch validates then make signin request
        if (this.state.recaptcha) {
            signin(user).then(data => {
                if (data.error)
                    this.setState({error: data.error, loading: false});//if error, no need of loading page
                else {

                    //store the user along with the socket id..
                    socket.emit('User_Connected',data.user._id)
                    //authenticate the user and redirect
                    //data frm backend contains the json webtoken
                    authenticate(data, () => {
                        this.setState({redirectTo: true});
                    });

                }// end of else
            });
        }
        else
        {
            this.setState({
                loading: false,
                error: "What day is tomorrow's next day? Please write a correct answer!"
            });
        }
    }; // end of onClickSubmit method

    //code refactoring -- moving form from render method to here
    signInForm = (email, password, recaptcha) => {
        return(
            <form>
                <div className="form-group">
                    <label className="text-muted">Email</label>
                    <input onChange={this.handleChange("email")} type="email" className="form-control" value={email}></input>
                </div>
                <div className="form-group">
                    <label className="text-muted">Password</label>
                    <input onChange={this.handleChange("password")} type="password" className="form-control" value={password}></input>
                </div>

                <div className="form-group">
                    <label className="text-muted">
                        {recaptcha ? "Thanks. You got it!" : "What day is tomorrow's next day?"}
                    </label>

                    <input
                        onChange={this.recaptchaHandler}
                        type="text"
                        className="form-control"
                    />
                </div>

                <button onClick={this.onClickSubmit} className="btn btn-raised btn-primary">submit</button>

            </form>
        );
    }; //end of signInForm


    //once there is some change in (email, password} fields they get populated we can
    // store it in value
    render() {
        const {email, password, error, redirectTo,loading, recaptcha} = this.state;
        if(redirectTo) //if redirect is true
        {
            return <Redirect to="/" />
        }

        return(

            <div className="container">
                <h2 className="mt-5 mb-5">signin</h2>
                <hr />
                <SocialLogin />
                <hr />
                <div className="alert alert-danger" style={{display: error? "":"none"}}>
                    {error}
                </div>
                {loading ? <div className="jumbotron text-center">
                    <h2>Loading ... </h2></div>: ""
                }

                {this.signInForm(email, password, recaptcha)}

                <p>
                    <Link to="/forgot-password" className="btn btn-raised btn-danger">
                        {" "}
                        Forgot Password
                    </Link>
                </p>

            </div>
        );
    }
}
export default Signin;