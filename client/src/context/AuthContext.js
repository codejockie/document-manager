import React from 'react';
import PropTypes from 'prop-types';

const AuthContext = React.createContext();

// eslint-disable-next-line require-jsdoc
class AuthProvider extends React.Component {
  state = { isAuth: false };

  static propTypes = {
    children: PropTypes.array
  };

  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <AuthContext.Provider value={{ isAuth: this.state.isAuth }}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const AuthConsumer = AuthContext.Consumer;
export { AuthProvider, AuthConsumer };
