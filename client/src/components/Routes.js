import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import ConnectedSignInPage from '../pages/SignInPage';
import ConnectedSignUpPage from '../pages/SignUpPage';

const Routes = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/signin" component={ConnectedSignInPage} />
      <Route path="/signup" component={ConnectedSignUpPage} />
    </Switch>
  </main>
);

export default Routes;
