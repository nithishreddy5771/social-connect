import React, {Component} from 'react';
import {comment, remove, uncomment} from "./apiPost";
import {isAuthenticated} from "../auth";
import {Link} from "react-router-dom";
import defaultImage from "../images/default_profile_image.png";

class Comment extends Component {
    state= {
        text: "",
        error: ""
    };

    handleChange = event => {
        this.setState({error: ""});
        this.setState({text: event.target.value})
    };

    isValid = () => {
        const {text}= this.state;
        if(text.length <= 0 || text.length > 150)
        {
            const error_message= text.length <=0 ? "comment shouldn't be empty":
                "comment shouldn't be more than 150 characters";
            this.setState({error: error_message});
            return false;
        }
        return true;
    }// end of isValid method

    addComment = event => {
        event.preventDefault();
        if(!isAuthenticated())
        {
            this.setState({error: "Please signin to leave a comment"});
            return false;
        }
        if(this.isValid())
        {
            const userId= isAuthenticated().user._id;
            const token= isAuthenticated().token;
            const postId= this.props.postId;
            const actual_comment= {text: this.state.text} //check backend inside comment we have text
            comment(userId, token, postId, actual_comment).then(data => {
                if(data.error)
                    console.log(data.error);
                else
                {
                    this.setState({text: ""}); //just clearing the text after storing comment successfully
                    //send fresh list of comments to parent component (SinglePost.js)
                    this.props.updateComments(data.comments);
                }
            })
        }
    } // end of addComment method

    deleteComment = (comment) => {
        const userId= isAuthenticated().user._id;
        const token= isAuthenticated().token;
        const postId= this.props.postId;
        //here we get comment from comments array .. each comment is object
        uncomment(userId, token, postId, comment).then(data => {
            if(data.error)
                console.log(data.error);
            else
            {
                this.setState({text: ""}); //just clearing the text after storing comment successfully
                //send fresh list of comments to parent component (SinglePost.js)
                this.props.updateComments(data.comments);
            }
        })

    } // end of deleteComment method

    deleteConfirmed= (comment) => {
        let answer= window.confirm("Are you sure you want to delete your comment?");
        if(answer)
            this.deleteComment(comment); //call to backend api to delete comment

    };// end of deleteConfirmed method

    render() {
        let {comments}= this.props;
        const {error}= this.state;
        comments= comments.reverse(); // to print recent comments at the top
        return (
            <div>
                <h2 className="mt-2 mb-2">Leave a comment....</h2>
                <form onSubmit={this.addComment}>
                    <div className="form-group">
                        <input type="text" onChange={this.handleChange}
                               value={this.state.text} placeholder="post a comment" className="form-control"
                               //by default text will be empty.. after commenting we again make it emtpy
                               // so always empty text field will be there to comment
                        />
                        <button className="btn btn-raised btn-success mt-2">post</button>
                    </div>
                </form>

                <div className="alert alert-danger" style={{display: error? "":"none"}}>
                    {error}
                </div>

                <div className="col-md-12">
                    <h3 className="text-primary">{comments.length} Previous Comments</h3>
                    <hr/>
                    {comments.map( (comment, index) => (
                        <div key={index}>
                            <div>
                                <Link to={`/user/${comment.postedBy._id}`}>
                                    <img className="float-left mr-2"
                                         height="40px"
                                         width="40px"
                                         style={{borderRadius:"50%", border:"1px solid grey"}}
                                         onError={i => (i.target.src = `${defaultImage}`)}
                                         src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                                         alt={comment.postedBy.name}/>
                                </Link>
                                <div>
                                    <p className="lead">{comment.text}</p>
                                    {/*<br/>*/}
                                    <p className="font-italic mark">
                                        posted by <Link to={`/user/${comment.postedBy._id}`}>{comment.postedBy.name} </Link>
                                        on {new Date(comment.created).toDateString()}

                                        <span>
                                            {isAuthenticated().user && isAuthenticated().user._id===comment.postedBy._id && (
                                                <>
                                                    <span onClick={ () => this.deleteConfirmed(comment)}
                                                            className="text-danger float-right mr-1"
                                                    >
                                                        delete
                                                    </span>
                                                </>
                                            )
                                            }
                                        </span>
                                    </p>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Comment;