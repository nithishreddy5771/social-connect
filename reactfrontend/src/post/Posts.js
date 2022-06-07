import React, {Component} from 'react';
import {list} from './apiPost';
import defaultPostImage from '../images/default-post-image.jpeg';
import {Link} from 'react-router-dom';

class Posts extends Component {
    constructor() {
        super();
        this.state= {
            posts: []
        }

    } // end of constructor

    componentDidMount() {
        list().then(data => {    //as soon as the component mounts, get all the posts' list
            if(data.error)
                console.log(data.error);
            else //store all posts from backend to posts list
                this.setState({posts: data});
        })
    }

    renderPosts= (posts) => {
        return(
            <div className="row">
                {posts.map((post, index) => { //if we use curly braces then use return
                    const posted_user_id= post.postedBy ? `/user/${post.postedBy._id}` : ""; // id of person who has posted
                    const posted_user_name= post.postedBy ? post.postedBy.name: "unknown"; // name of person who has posted
                    //we use above 2 variables to create a link to the user profile
                    return(
                        <div className="card col-md-4" key={index}>
                            <div className="card-body">
                                <img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}`}
                                     alt={post.title}
                                     onError={i => i.target.src= `${defaultPostImage}`}
                                     className="img-thumbnail mb-3"
                                     style={{height: "200px", width: "100%"}}
                                     />
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{`${post.body.substring(0, 20)} ..`}</p>
                                <br/>
                                <p className="font-italic mark">
                                    posted by <Link to={posted_user_id}>{posted_user_name} </Link>
                                    on {new Date(post.created).toDateString()}
                                </p>
                                <Link to={`/post/${post._id}`}
                                      className="btn btn-raised btn-primary bt-sm">
                                    see more..
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    };// end of renderPosts


    render() {
        const {posts}= this.state;
        return (
            <div className="container">
                {/*posts is an array. so, check posts length*/}
                <h2 className="mt-5 mb-5">{!posts.length ? "Loading ..." : "recent posts"}</h2>
                {this.renderPosts(posts)}
            </div>

        );
    }
}

export default Posts;