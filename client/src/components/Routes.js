import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import ConnectedSignInPage from '../pages/SignInPage';
import ConnectedSignUpPage from '../pages/SignUpPage';

const Routes = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/auth/signin" component={ConnectedSignInPage} />
      <Route path="/auth/signup" component={ConnectedSignUpPage} />
    </Switch>
  </main>
);

export default Routes;
