
import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Menu from './core/Menu';
import Home from './core/Home';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Profile from './user/Profile';
import Users from './user/Users';
import EditProfile from "./user/EditProfile";
import PrivateRoute from "./auth/PrivateRoute";
import FindPeople from "./user/FindPeople";
import NewPost from "./post/NewPost";
import Posts from "./post/Posts";
import SinglePost from "./post/SinglePost";
import EditPost from "./post/EditPost";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import Admin from "./admin/Admin";

const MainRouter = () => (
  <div>
      <Menu />
      <Switch>
          <Route exact path="/" component={Home}></Route>
          <PrivateRoute exact path="/admin" component={Admin} />
          <PrivateRoute exact path="/create/post" component={NewPost}/>
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword} />
          <Route exact path="/signup" component={Signup}/>
          <Route exact path="/signin" component={Signin}/>
          <Route exact path="/user/:userId" component={Profile}/>
          <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
          <Route exact path="/users" component={Users}/>
          {/*<Route exact path="/posts" component={Posts} />*/}
          <PrivateRoute exact path="/findPeople" component={FindPeople} />
          <Route exact path="/post/:postId" component={SinglePost} />
          <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />

      </Switch>
  </div>
);

export default MainRouter;
