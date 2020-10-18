import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from 'components/Home';
import AuthForm from 'containers/AuthForm';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/signin" component={() => <AuthForm />} />
    <Route path="/signup" component={() => <AuthForm isRegistration />} />
  </Switch>
);

export default Routes;
