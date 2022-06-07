import React, {Component} from 'react';
import {list} from './apiUser';
import defaultImage from '../images/default_profile_image.png';
import {Link} from 'react-router-dom';

class Users extends Component {
    constructor() {
        super();
        this.state= {
            users: []
        }

    } // end of constructor

    componentDidMount() {
        list().then(data => {
            if(data.error)
                console.log(data.error);
            else //store all users from backend to users list
                this.setState({users: data});
        })
    }

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
                            <Link to={`/user/${user._id}`} className="btn btn-raised btn-primary bt-sm">view profile</Link>
                        </div>
                </div>
            ))}
        </div>
    );


    render() {
        const {users}= this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Users</h2>
                {this.renderUsers(users)}
            </div>

        );
    }
}

export default Users;