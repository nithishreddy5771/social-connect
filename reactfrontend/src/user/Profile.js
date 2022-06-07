import React, {Component} from 'react';
import {isAuthenticated} from "../auth";
import {Link, Redirect} from "react-router-dom";
import {read} from "./apiUser";
import defaultImage from '../images/default_profile_image.png';
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import ProfileTabs from "./ProfileTabs";
import {allPostsByUser} from "../post/apiPost";
import Message from './Message';

class Profile extends Component
{
    constructor() {
        super();
        this.state={
            user: {following: [], followers: []},
            redirectToSignin: false, //when the user is not loggedin
            following: false, // by default not following
            error: "",
            posts: []
        };
    }

    //check following or not
    checkFollow = user => {
        //user will be the input from front end --- user is on whose profile we click to follow
        const jwt= isAuthenticated();
        //arrow function checking in the user's follower list whether loggedin user is already present
        const match= user.followers.find(follower => {
            //one id has many follower ids in followers list
            return follower._id === jwt.user._id
        });
        return match; //returns true if loggedin user is already present in followers list
    }; // end of checkFollow method

    //here a method will be passed as parameter to the clickFollowButton
    clickFollowButton = callApi => {
        const userId= isAuthenticated().user._id;
        const token= isAuthenticated().token;

        callApi(userId, token, this.state.user._id).then(data => {
            if(data.error)
                this.setState({error: data.error});
            else
                this.setState({user: data, following: !this.state.following });
                // we use same method for follow & unfollow, with not operator compliment the following state
        }); // end of callApi method
    }

    //load posts to populate posts by calling allPostsById method of apiPosts.js
    loadPosts = (userId) => {
        const token= isAuthenticated().token;
        allPostsByUser(userId, token).then(data => {
            //console.log("printing all posts by user inside loadPosts method Profile.js line 54");
            if(data.error)
                console.log(data.error);
            else
                this.setState({posts: data});
        })
    }// end of loadPosts method

    init = userId => {
        //passing the userId passed from componentDidMount method
        read(userId, isAuthenticated().token)
            .then(data => {
                if(data.error) //if we get any error in the response from back end
                    this.setState({redirectToSignin: true});
                else
                {
                    let following= this.checkFollow(data);
                    this.setState({user: data, following: following});
                    this.loadPosts(data._id); // calling allPostsById with user id
                }
            });
    }

    componentDidMount()
    {
        const userId= this.props.match.params.userId;
        this.init(userId);

    } //end of componentDidMount method

    //this method will be executed when the props changes
    componentWillReceiveProps(props)
    {
        const userId= props.match.params.userId; //this is the userId after we click on profile
        this.init(userId);

    } //end of componentDidMount method

    render(){
        const {redirectToSignin, user, posts} = this.state;
        //console.log("inside profile.js printing user.followers", user.followers);
        if(redirectToSignin) // if true, then we have to sign in
            return <Redirect to="/signin" />
        const photoUrl= user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : defaultImage;
        //console.log("photoUrl in Profile.js ", photoUrl);
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">profile</h2>
                <div className="row">
                    <div className="col-md-4">
                        <img src={photoUrl} style={{height: "200px", width: "auto"}}
                             onError={i => (i.target.src= `${defaultImage}`)}
                             className="img-thumbnail" alt={user.name}/>
                    </div>
                    <div className="col-md-8">
                        <div className="lead mt-2">
                            <p style={{color: "brown", fontSize: "40px"}}>{user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>joined on: {new Date(user.created).toDateString()}</p>
                        </div>
                        {isAuthenticated().user && isAuthenticated().user._id===user._id ? (
                            <div className="d-inline-block">
                                <Link className="btn btn-raised btn-info mr-5"
                                      to={`/create/post`}
                                >
                                    Create Post
                                </Link>
                                <Link className="btn btn-raised btn-success mr-5"
                                      to={`/user/edit/${user._id}`}
                                >
                                    Edit Profile
                                </Link>
                                <DeleteUser userId={user._id} />
                            </div>
                        ) : (
                            <>
                                <FollowProfileButton
                                    following={this.state.following}
                                    onButtonClick={this.clickFollowButton} />

                                <Message user={user} />

                            </>
                            )
                        }

                        <div>
                            {isAuthenticated().user &&
                            isAuthenticated().user.role === "admin" && (
                                <div className="card mt-5">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            Admin
                                        </h5>
                                        <p className="mb-2 text-danger">
                                            Edit/Delete as an Admin
                                        </p>
                                        <Link
                                            className="btn btn-raised btn-success mr-5"
                                            to={`/user/edit/${user._id}`}
                                        >
                                            Edit Profile
                                        </Link>
                                        <DeleteUser userId={user._id}/>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
                <div className="row">
                    <div className="col md-12 mb-5">
                        <hr/>
                        <p className="lead">{user.about}</p>
                        <hr/>

                        <ProfileTabs followers={user.followers}
                                     following={user.following}
                                     posts={posts}
                        />
                    </div>
                </div>

            </div>
        );
    };// end of render method
} // end of class profile

export default Profile;