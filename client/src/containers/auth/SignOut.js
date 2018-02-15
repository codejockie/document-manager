import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../actions';

/**
 * SignOut component
 */
class SignOut extends React.Component {
  /**
   * Sign a user out
   * @returns {void}
   */
  componentWillMount() {
    this.props.signOutUser();
  }

  static propTypes = {
    signOutUser: PropTypes.func.isRequired
  };

  /**
   * Render sign out message
   * @returns {HTMLElement} message
   */
  /* eslint-disable */
  render() {
    return (
      <div>Sorry to see you go...</div>
    );
  }
}

export default connect(null, actions)(SignOut);
