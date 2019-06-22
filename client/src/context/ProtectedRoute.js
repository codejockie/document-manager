import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import { AuthConsumer } from './AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <AuthConsumer>
    {({ isAuth }) => (
      <Route
        render={props => (isAuth ? <Component {...props} /> : <Redirect to="/" />)}
        {...rest}
      />
    )}
  </AuthConsumer>
);

ProtectedRoute.propTypes = {
  component: PropTypes.element.isRequired
};

export default ProtectedRoute;
