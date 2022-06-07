
import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {signout, isAuthenticated} from "../auth";

const isActive = (history, path) => {
    if(history.location.pathname === path)
        return {color: "#a52a2a"};
    else
        return {color: "#ffffff"};
}; // end of isActive method



const Menu = ({history}) => (
    <div>
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
            <Link className="nav-link" style={isActive(history, "/")} to="/">Home</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, "/users")} to="/users">Users</Link>
            </li>
            <li className="nav-item">
                <Link to="/create/post"
                      style={isActive(history, `/create/post`)}
                      className="nav-link">
                    create new post
                </Link>
            </li>
            {/*
            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, "/posts")} to="/posts">Posts</Link>
            </li>
            */}
            {!isAuthenticated() && (
                <>
                    <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, "/signup")} to="/signup">Sign-Up</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" style={isActive(history, "/signin")} to="/signin">Sign-In</Link>
                    </li>
                </>
            )}

            {isAuthenticated() && (
                <>

                    <li className="nav-item">
                        <Link to={`/user/${isAuthenticated().user._id}`}
                              style={isActive(history, `/user/${isAuthenticated().user._id}`)}
                              className="nav-link">
                        {`${isAuthenticated().user.name}'s profile`}
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/findPeople"
                              style={isActive(history, `/findPeople`)}
                              className="nav-link">
                            Find people
                        </Link>
                    </li>

                    <li className="nav-item">
                      <span
                          className="nav-link"
                          style={( isActive(history, "/signout"), {cursor: "pointer", color:"#fff"} )}
                          onClick={ () => signout( () => history.push('/') ) }
                      >
                      Sign-Out
                      </span>
                    </li>

                </>
            )}

            {isAuthenticated() && isAuthenticated().user.role === "admin" && (
                <li className="nav-item">
                    <Link
                        to={`/admin`}
                        style={isActive(history, `/admin`)}
                        className="nav-link"
                    >
                        Admin
                    </Link>
                </li>
            )}

        </ul>
    </div>
);

export default withRouter(Menu);



