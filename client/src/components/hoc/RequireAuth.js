import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


/**
 * HOC - Prevent user from accessing a component
 * if they are not authentciated
 * @param {Component} EnhancedComponent
 * @returns {Component} EnhancedComponent
 */
export default (EnhancedComponent) => {
  /**
   * Authentication component
   */
  class Authentication extends React.Component {
    static contextTypes = {
      router: PropTypes.object
    }

    /**
     * Check if a user is authenticated on component
     * mounting
     * @returns {void}
     */
    componentWillMount() {
      if (!this.props.authenticated) {
        this.context.router.history.push('/auth/signin');
      }
    }

    /**
     * Check if a user is authenticated on component's
     * next update
     * @param {object} nextProps New incoming props
     * @returns {void}
     */
    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
        this.context.router.history.push('/auth/signin');
      }
    }

    /**
     * Render enhanced component
     * @returns {void}
     */
    render() {
      return <EnhancedComponent {...this.props} />;
    }
  }

  /**
   * mapStateToProps - Maps redux state date to props
   * for SignIn component
   * @param {bool} Auth state
   * @returns {object} state.authenticated
   */
  function mapStateToProps({ auth: { authenticated } }) {
    return { authenticated };
  }

  return connect(mapStateToProps)(Authentication);
};
