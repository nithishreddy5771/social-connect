import React, {Component} from 'react';
import {singlePost, remove, like, unlike} from "./apiPost";
import defaultPostImage from "../images/default-post-image.jpeg";
import {Link, Redirect} from "react-router-dom";
import {isAuthenticated} from "../auth";
import Comment from "./Comment";

class SinglePost extends Component {
    state= {
        post: "",
        liked: false, //state whether user liked or unliked
        likes: 0, // keep track of no of likes , by default 0
        redirectToHome: false,  //after deleting post redirect to home page where all posts are present
        redirectToSignin: false,
        comments: []
    }

    checkLike = likes => {
        //console.log("inside checkLike method");
        //console.log(isAuthenticated().user._id);
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match= likes.indexOf(userId) !== -1; //if userId is not present in likes array then returns -1
        return match;
    }

    componentDidMount() {
        const postId= this.props.match.params.postId;
        singlePost(postId).then(data => {
            if(data.error)
                console.log(data.error);
            else
                this.setState({
                    post: data,
                    likes: data.likes.length,
                    liked: this.checkLike(data.likes), //passing likes array from back end
                    comments: data.comments
                });
        })
    }; // end of componentDidMount method

    updateComments = comments => {
        this.setState({comments: comments});
    }

    likeToggle= () => {
        if(!isAuthenticated()) //if user is not signed in and trying to like -- then open sign in page
        {
            this.setState({redirectToSignin: true});
            return false; //returning to stop executing below lines of code
        }
        let callApi= this.state.liked ? unlike : like ;
        const userId= isAuthenticated().user._id;
        const postId= this.state.post._id;
        const token= isAuthenticated().token;
        callApi(userId, token, postId).then(data =>{
            if(data.error)
                console.log(data.error)
            else
                this.setState({
                    liked: !this.state.liked,  //reversing the state
                    likes: data.likes.length, //updating the no of likes
                })
        })
    } // end of likeToggle

    deletePost = () => {
        const postId= this.props.match.params.postId;
        const token= isAuthenticated().token;
        remove(postId, token).then(data => {
            if(data.error)
                console.log(data.error);
            else
                this.setState({redirectToHome: true});
        })

    } // end of deletePost method

    deleteConfirmed= () => {
        let answer= window.confirm("Are you sure you want to delete the current post?");
        if(answer)
            this.deletePost(); //call to backend api to delete post

    };// end of deleteConfirmed method

    renderPost = (post) => {
        //console.log("printing post: ", post);
        //console.log("inside render post..printing postedBy id", post.postedBy); //gives error for unknown posts

        const posted_user_id = post.postedBy ? `/user/${post.postedBy._id}` : ""; // id of person who has posted
        //console.log("inside renderPost posted user id is ", posted_user_id);
        const posted_user_name = post.postedBy ? post.postedBy.name : "unknown"; // name of person who has posted
        const {liked, likes}= this.state;
        //we use above 2 variables to create a link to the user profile
        return (
            <div className="card-body" align="center">
                <img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}`}
                     alt={post.title}
                     onError={i => i.target.src = `${defaultPostImage}`}
                     className="img-thumbnail mb-3"
                     style={{height: "300px", width: "500px", objectFit: "cover"}}
                />

                {liked? (<h3 onClick={this.likeToggle}>
                            <i className="fa fa-thumbs-down text-warning bg-dark"
                                style={{padding: "10px", borderRadius:"50%"}}></i> {" "}
                        {likes} Likes </h3>
                    ) :
                    (<h3 onClick={this.likeToggle}>
                            <i className="fa fa-thumbs-up text-success bg-dark"
                               style={{padding: "10px", borderRadius:"50%"}}></i>
                            {likes} Likes </h3>
                    )
                }

                <p className="card-text">{post.body}</p>
                <br/>
                <p className="font-italic mark">
                    posted by <Link to={posted_user_id}>{posted_user_name} </Link>
                    on {new Date(post.created).toDateString()}
                </p>
                <div className="d-inline-block">
                    <Link to={`/`}
                          className="btn btn-raised btn-primary bt-sm mr-5">
                        back to posts
                    </Link>
                    {isAuthenticated().user && isAuthenticated().user._id===post.postedBy._id && (
                        <>
                            <Link to={`/post/edit/${post._id}`}
                                  className="btn btn-raised btn-info mr-5">
                                update post
                            </Link>
                            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-warning">
                                delete post
                            </button>
                        </>
                        )
                    }

                    <div>
                        {isAuthenticated().user &&
                        isAuthenticated().user.role === "admin" && (
                            <div className="card mt-2">
                                <div className="card-body">
                                    <h5 className="card-title">Admin</h5>
                                    <p className="mb-2 text-danger">
                                        Edit/Delete as an Admin
                                    </p>
                                    <Link
                                        to={`/post/edit/${post._id}`}
                                        className="btn btn-raised btn-info mr-2"
                                    >
                                        Update Post
                                    </Link>
                                    <button
                                        onClick={this.deleteConfirmed}
                                        className="btn btn-raised btn-warning"
                                    >
                                        Delete Post
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

        ) //end of return statement
    }; // end of renderPost method

    render() {
        const {post, redirectToHome, redirectToSignin, comments} = this.state;
        if(redirectToHome)
            return <Redirect to={`/`} />;
        if(redirectToSignin)
            return <Redirect to={`/signin`} />

        return (
            <div className="container">
                <h2 className="display-4 mt-3" align="center">{post.title}</h2>
                {/*if post is not populated yet, then display loading */}
                { !post ? (
                    <div className="jumbotron text-center">
                    <h2>Loading ... </h2></div>
                    ):
                    (this.renderPost(post))
                }

                <Comment postId={post._id} comments={comments} updateComments={this.updateComments}/>
            </div>
        );
    }
} // end of SinglePost component

export default SinglePost;