import React, {Component} from 'react';
import {follow, unfollow} from './apiUser';

class FollowProfileButton extends Component {
    followClick = () => {
        //when the button is clicked we call onButtonClick={this.clickFollowButton method in Profile component
        // clickFollowButton requires a method as input.
        // we are sending follow method as parameter which will act as callApi method
        this.props.onButtonClick(follow); //follow is the method passed as callApi method
    };
    unfollowClick = () => {
        this.props.onButtonClick(unfollow); //unfollow is the method passed as callApi method
    };
    render() {
        return (
            <div className="d-inline-block mt-2">
                {
                    !this.props.following ? (
                        <button onClick={this.followClick} className="btn btn-primary btn-raised mr-5">
                            Follow
                        </button>
                    ) : (
                        <button onClick={this.unfollowClick} className="btn btn-secondary btn-raised">
                            Unfollow
                        </button>
                    ) // end of ternary statement
                }
            </div>
        );
    } // end of render method
}

export default FollowProfileButton;