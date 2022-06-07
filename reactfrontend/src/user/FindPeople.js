import React, {Component} from 'react';
import {findPeople, follow} from './apiUser';
import defaultImage from '../images/default_profile_image.png';
import {Link} from 'react-router-dom';
import {isAuthenticated} from "../auth";

class FindPeople extends Component {
    constructor() {
        super();
        this.state= {
            users: [],
            error: "",
            followMessage: "",
            open: false  //helpful in printing the message
        }

    } // end of constructor

    componentDidMount() {
        const userId= isAuthenticated().user._id;
        const token= isAuthenticated().token;
        findPeople(userId, token).then(data => {
            if(data.error)
                console.log(data.error);
            else //store all users from backend to users list
                this.setState({users: data});
        })
    }; // end of componentDidMount method

    clickFollow= (user, index) => {
            const userId= isAuthenticated().user._id;
            const token= isAuthenticated().token;
            //accessing follow method in apiUser.js
            follow(userId, token, user._id) // calling follow method to follow that user id
                .then(data => {
                    if(data.error)
                        this.setState({error: data.error});
                    else
                    {
                        //once we click follow on any user then we need to remove that user from our users list
                        // i.e we need to add that userId to following list
                        let toFollow= this.state.users;
                        toFollow.splice(index, 1);//deleting 1 user starting at index position from users list
                        this.setState({users : toFollow});
                        this.setState({open: true, followMessage: `following ${user.name}` });
                    }
                })
    }; //end of clickFollow method

    renderUsers= (users) => (
        <div className="row">
            {users.map((user, index) => ( //if we use curly braces then user return
                <div className="card col-md-4" key={index}>
                    <img src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`}
                         onError={i => (i.target.src= `${defaultImage}`)}
                         style={{height: "200px", width: "auto"}}
                         className="img-thumbnail" alt={user.name}/>

                    <div className="card-body">
                        <h5 className="card-title">{user.name}</h5>
                        <p className="card-text">{user.email}</p>
                        <Link to={`/user/${user._id}`}
                              className="btn btn-raised btn-primary bt-sm">
                            view profile
                        </Link>
                        <button onClick={() => this.clickFollow(user, index)}
                                className="btn btn-raised btn-info float-right btn-sm">
                            follow
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );


    render() {
        const {users, open, followMessage}= this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">users you can follow</h2>
                { open && (
                    <div className="alert alert-success">
                    <p>{followMessage}</p>
                    </div> )
                }
                {this.renderUsers(users)}
            </div>

        );
    }
}

export default FindPeople;