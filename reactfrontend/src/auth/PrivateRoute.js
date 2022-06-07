import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {isAuthenticated} from './index';

//PrivateRoute higher order component which takes another component as input
const PrivateRoute= ({ component: Component, ...rest }) => (
    //props are components passed to this private route component
    <Route {...rest} render={props => isAuthenticated() ? (
        <Component {...props} />
    ) : (
        <Redirect to={{pathname: "/signin", state: {from: props.location} }} />
    )} />

);

export default PrivateRoute;

