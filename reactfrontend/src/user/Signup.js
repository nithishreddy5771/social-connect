
import React, {Component} from 'react';
import {signup} from '../auth';
import {Link} from 'react-router-dom';

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false,  // initially no error
            recaptcha: false,
            passwordConfirm: ""
        };
    } // end of constructor
    //curried function -- on calling function with one parameter name it will return another function
    // which requires event as input and sets the state
    handleChange = name => event => {
        this.setState({error: ""});
        this.setState({open: false}); //to deactivate the div element once user starts signup again
        this.setState({[name]: event.target.value});
    };

    confirmPasswordHandler= () => {
        this.setState({error: ""});
        return this.state.password===this.state.passwordConfirm;
    } // end of confirmPasswordHandler

    recaptchaHandler = event => {
        this.setState({ error: "" });
        let userDay = event.target.value.toLowerCase();
        //console.log("inside recaptchaHandler method", userDay);
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
        const {name, email, password} = this.state;
        const user = {
            name,
            email,
            password
        };
        //console.log(user);
        //if captch validates then make signup request
        if (this.confirmPasswordHandler() && this.state.recaptcha ) {
            signup(user).then(data => {
                if (data.error)
                    this.setState({error: data.error});
                else //clearing the object of state -- old values to empty string
                    this.setState({
                        name: "",
                        email: "",
                        password: "",
                        passwordConfirm: "",
                        error: "",
                        open: true //on successful user creation. to activate div element to show in frontend
                    });
            });
        }
        else
        {
            //console.log("password checking ", this.confirmPasswordHandler());
            this.setState({
                loading: false,
                error: this.confirmPasswordHandler() ?
                    "What day is tomorrow's next day? Please write a correct answer!" :
                    "Password and Confirm Password should match.Please enter the password again!"
            });
        }
    }; // end of onClickSubmit method




    //code refactoring -- moving form from render method to here
    signUpForm = (name, email, password, passwordConfirm, recaptcha) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={this.handleChange("name")} type="text" className="form-control" value={name}></input>
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={this.handleChange("email")} type="email" className="form-control" value={email}></input>
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={this.handleChange("password")} type="password" className="form-control" value={password}></input>
            </div>

            <div className="form-group">
                <label className="text-muted">Confirm Password</label>
                <input onChange={this.handleChange("passwordConfirm")} type="password" className="form-control" value={passwordConfirm} />
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
    ); //end of signUpForm


    //once there is some change in (name, email, password} fields they get populated we can
    // store it in value
    render() {
        const {name, email, password, passwordConfirm, error, open, recaptcha} = this.state;
        return(
            <div className="container">
                <h2 className="mt-5 mb-5">signup</h2>
                <div className="alert alert-danger" style={{display: error? "":"none"}}>
                    {error}
                </div>
                <div className="alert alert-info" style={{display: open? "":"none"}}>
                    user account created. Use email and password to <Link to="/signin">Signin</Link>.
                </div>
                {this.signUpForm(name, email, password, passwordConfirm, recaptcha)}
            </div>
        );
    }
}
export default Signup;