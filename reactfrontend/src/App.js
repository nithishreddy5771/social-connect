import React from 'react';
import MainRouter from './MainRouter';
import {BrowserRouter} from 'react-router-dom';
// load env variables
const dotenv = require('dotenv');
dotenv.config()

const App = () => (
    <BrowserRouter>
        <MainRouter />
    </BrowserRouter>
);
export default App;
