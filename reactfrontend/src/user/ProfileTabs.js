import React, {Component} from 'react';
import {Link} from "react-router-dom";
import defaultImage from '../images/default_profile_image.png';

class ProfileTabs extends Component {
    render() {
        const {followers, following, posts}= this.props
        return (
            <div>
                <div className="row">

                    <div className="col-md-4">
                        <h3 className="text-primary">{followers.length} Followers</h3>
                        <hr/>
                        {followers.map( (person, index) => (
                            <div key={index}>
                                <div>
                                    <Link to={`/user/${person._id}`}>
                                        <img className="float-left mr-2"
                                             height="40px"
                                             width="40px"
                                             style={{borderRadius:"50%", border:"1px solid grey"}}
                                             onError={i => (i.target.src = `${defaultImage}`)}
                                             src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                             alt={person.name}/>
                                        <div>
                                            <p className="lead">{person.name}</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-md-4">
                        <h3 className="text-primary">{following.length} Following</h3>
                        <hr/>
                        {following.map( (person, index) => (
                            <div key={index}>
                                <div>
                                    <Link to={`/user/${person._id}`}>
                                        <img className="float-left mr-2"
                                             height="40px"
                                             width="40px"
                                             style={{borderRadius:"50%", border:"1px solid grey"}}
                                             onError={i => (i.target.src = `${defaultImage}`)}
                                             src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                                             alt={person.name}/>
                                        <div>
                                            <p className="lead">{person.name}</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className="col-md-4">
                        <h3 className="text-primary">{posts.length} Posts</h3>
                        <hr/>
                        {posts.map( (post, index) => (
                            <div key={index}>
                                <div>
                                    <Link to={`/post/${post._id}`}>
                                        <div>
                                            <p className="lead">{post.title}</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        );
    }
}

export default ProfileTabs;