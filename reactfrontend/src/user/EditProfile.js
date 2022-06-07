import React, {Component} from 'react';
import {isAuthenticated} from "../auth";
import {read, update, updateUser} from "./apiUser";
import {Redirect} from "react-router-dom";
import defaultImage from "../images/default_profile_image.png";

class EditProfile extends Component {

    constructor() {
        super();
        this.state= {
            id: "",
            name: "",
            email: "",
            password: "",
            error: "",
            redirectToProfile: false,
            loading: false,
            fileSize: 0,
            about: ""
            //userData: ""
        }
    }; // end of constructor

    init = userId => {
        //passing the userId passed from componentDidMount method
        read(userId, isAuthenticated().token)
            .then(data => {
                if(data.error) //if we get any error in the response from back end
                    this.setState({redirectToProfile: true});
                else
                    this.setState({id: data._id, name: data.name, email: data.email,
                        error: "", about: data.about });
            });
    }

    componentDidMount()
    {
        this.userData= new FormData();
        const userId= this.props.match.params.userId;
        this.init(userId);

    } //end of componentDidMount method

    isValid = () => {
        const {name, email, password, fileSize} = this.state;
        if(fileSize > 1000000)  // if size > 1 mb
        {
            this.setState({error: "file size should be less than 1 mb", loading: false});
            return false;
        }
        else if(name.length === 0)//set loading=false(deactivate loading page) while showing error prompt
        {
            this.setState({error: "Name is required", loading: false});
            return false;
        }
        // email check using regular expression
        // in js regex is enclose inside / /    -- someone@someaddress.com or fd@add.co.in
        if( !(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.+[a-zA-Z]+$/.test(email)) ) //email is not valid
        {
            this.setState({error: "enter valid email address", loading: false});
            return false;
        }
        if(password.length > 0 && password.length<6) //if user tries to update the password
        {
            this.setState({error: "password must be at least of length 6", loading: false});
            return false;
        }
        return true; // if no error, we return true

    }; // end of isValid method

    //curried function -- on calling function with one parameter name it will return another function
    // which requires event as input and sets the state
    handleChange = name => event => {
        this.setState({error: ""}); //making error print inactive on front end
        let value = (name === "photo" ? event.target.files[0] : event.target.value);
        const photoSize= name === "photo"? event.target.files[0].size: 0 ;
        if(name === "password" && name.length===0)//if password length is 0,then update without password
            value= undefined;
        this.userData.set(name, value);
        this.setState({[name]: value, fileSize: photoSize});
    };

    //onClickSubmit will get an event upon clicking
    onClickSubmit = event => {
        //preventing default behaviour of the browser. i.e reloading on click
        event.preventDefault();
        this.setState({loading: true});
        if(this.isValid())
        {
            //console.log(user);
            const userId= this.props.match.params.userId;
            const token= isAuthenticated().token;

            update(userId, token, this.userData).then(data => {
                if(data.error)
                    this.setState({error: data.error});
                //need not updated localStorage while editing as admin
                else if (isAuthenticated().user.role === "admin") {
                    this.setState({
                        redirectToProfile: true
                    });
                }
                else //clearing the object of state -- old values to empty string
                    //data -- we get entire updated user info from back end api call as response
                    updateUser(data, () => {
                        this.setState({
                            redirectToProfile: true
                        });
                    });
            });
        } //end of if(isValid()) condition
        else
            this.setState({loading: false}) //inactivating loading page div element
    }; // end of onClickSubmit method

    //code refactoring -- moving form from render method to here
    editForm = (name, email, password, about) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Profile pic</label>
                <input onChange={this.handleChange("photo")} type="file" accept="image/*" className="form-control"></input>
            </div>
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
                <label className="text-muted">About</label>
                <textarea onChange={this.handleChange("about")} type="text" className="form-control" value={about}></textarea>
            </div>
            <button onClick={this.onClickSubmit} className="btn btn-raised btn-primary">update</button>

        </form>
    ); //end of editForm

    render() {
        const {id, name, email, password, redirectToProfile, error, loading, about} = this.state;
        if(redirectToProfile)
            return <Redirect to={`/user/${id}`} />
        const photoUrl= id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : defaultImage;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit user's profile</h2>
                <div className="alert alert-danger" style={{display: error? "":"none"}}>
                    {error}
                </div>
                {loading ? <div className="jumbotron text-center">
                    <h2>Loading ... </h2></div>: ""
                }

                <img src={photoUrl} style={{height: "200px", width: "auto"}}
                     onError={i => (i.target.src= `${defaultImage}`)}
                     className="img-thumbnail" alt={name}/>

                {this.editForm(name, email, password, about)}
            </div>
        );
    };
} // end of EditProfile component

export default EditProfile;