import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import SignIn from '../containers/auth/SignIn';

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/auth/signin" component={SignIn} />
    </Switch>
  </main>
);

export default Main;
