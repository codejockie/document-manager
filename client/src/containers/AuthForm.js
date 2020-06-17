import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Material UI
import Snackbar from '@material-ui/core/Snackbar';

import * as actions from 'actions/auth';
import authForm from 'components/AuthForm';
import SnackbarContentProps from 'common/SnackbarContentProps';

const anchorOrigin = {
  vertical: 'bottom',
  horizontal: 'center',
};

/**
 * SignIn Page
 * @returns {void}
 */
export class AuthForm extends React.PureComponent {
  static propTypes = {
    errorMessage: PropTypes.string,
    history: PropTypes.object,
    isRegistration: PropTypes.bool,
    signInUser: PropTypes.func.isRequired,
    signUpUser: PropTypes.func.isRequired
  };

  /**
   * submit
   * @param {object} values
   * @returns {HTMLElement} Sign In Form
   */
  handleSubmit = (values) => {
    this.setState({ open: true }); // Set open to true to reveal snack bar in case of error
    if (this.props.isRegistration) {
      this.props.signUpUser(values, this.props.history);
      return;
    }
    const { email, password } = values;
    this.props.signInUser({ email, password }, this.props.history);
  }

  /**
   * handleClose
   * @param {object} event Event object
   * @param {string} reason The cause of the event
   * @returns {void}
   */
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  /**
   * renderAlert - Renders a snack bar to notify the user
   * of any error during form submission
   * @param {object} event Event object
   * @param {string} reason The cause of the event
   * @returns {void}
   */
  renderAlert = () => (
    <div>
      <Snackbar anchorOrigin={anchorOrigin} open={this.state.open} autoHideDuration={5000} onClose={this.handleClose}>
        <SnackbarContentProps onClose={this.handleClose} variant="error" message={this.props.errorMessage} />
      </Snackbar>
    </div>
  );

  /**
   * render - Renders a signin form
   * @returns {HTMLElement} Sign In Form
   */
  render() {
    const { errorMessage, isRegistration } = this.props;
    const formName = isRegistration ? 'signup' : 'signin';
    // TODO: Find a better name for this
    const AuthenticationForm = authForm(formName);
    return (
      <>
        <AuthenticationForm
          isRegistration={isRegistration}
          onSubmit={this.handleSubmit}
        />
        { errorMessage && this.renderAlert() }
      </>
    );
  }
}

const ConnectedAuthForm = connect(state => ({
  errorMessage: state.auth.error
}), actions)(AuthForm);
export default withRouter(ConnectedAuthForm);
