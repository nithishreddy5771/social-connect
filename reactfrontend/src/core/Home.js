
//name of component file starts with capital letter -- just a convention
import React from 'react';
import Posts from "../post/Posts";

const Home = () => (

    <div>
        <div className="jumbotron">
            <h2>Home</h2>
            <p> welcome to home page</p>
        </div>
        <div className="container">
            <Posts />
        </div>
    </div>
);

export default Home;


