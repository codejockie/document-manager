import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Material UI
import Snackbar from '@material-ui/core/Snackbar';

import * as actions from '../actions/auth';
import SignUpForm from '../containers/auth/SignUpForm';
import SnackbarContentProps from '../ui/SnackbarContentProps';

const anchorOrigin = {
  vertical: 'bottom',
  horizontal: 'center',
};

/**
 * SignIn Page
 * @returns {void}
 */
export class SignUpPage extends React.PureComponent {
  static propTypes = {
    errorMessage: PropTypes.string,
    history: PropTypes.object,
    signUpUser: PropTypes.func.isRequired
  };

  state = {
    showPassword: false
  };

  /**
   * showPasssword
   * @returns {void}
   */
  showPasssword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  /**
   * submit
   * @param {object} values
   * @returns {HTMLElement} Sign In Form
   */
  submit = (values) => {
    const { email, firstname, lastname, password, username } = values;
    this.setState({ open: true }); // Set open to true to reveal snack bar in case of error
    this.props.signUpUser({ email, firstname, lastname, password, username }, this.props.history);
  }

  /**
   * handleClose
   * @param {object} _ Event object
   * @param {string} reason The cause of the event
   * @returns {void}
   */
  handleClose = (_, reason) => {
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
      <Snackbar anchorOrigin={anchorOrigin} open={this.state.open} autoHideDuration={10000} onClose={this.handleClose}>
        <SnackbarContentProps onClose={this.handleClose} variant="error" message={this.props.errorMessage} />
      </Snackbar>
    </div>
  );

  /**
   * render - Renders a signin form
   * @returns {HTMLElement} Sign In Form
   */
  render() {
    return (
      <React.Fragment>
        <SignUpForm isPasswordVisible={this.state.showPassword} onSubmit={this.submit} showPasssword={this.showPasssword} />;
        { this.props.errorMessage && this.renderAlert() }
      </React.Fragment>
    );
  }
}

/**
   * mapStateToProps - Maps redux state date to props
   * for SignIn component
   * @param {object} state Redux state
   * @returns {object} state.errorMessage
   */
function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default withRouter(connect(mapStateToProps, actions)(SignUpPage));
