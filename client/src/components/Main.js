import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import SignIn from '../containers/auth/SignIn';
import SignOut from '../containers/auth/SignOut';
import SignUp from '../containers/auth/SignUp';

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/auth/signin" component={SignIn} />
      <Route path="/signout" component={SignOut} />
      <Route path="/auth/signup" component={SignUp} />
    </Switch>
  </main>
);

export default Main;
