import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isAlpha, isEmail, isEmpty } from 'validator';

// Material-UI component imports
import Button from 'material-ui/Button';
import Card, { CardContent } from 'material-ui/Card';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Snackbar from 'material-ui/Snackbar';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';

import * as actions from '../../actions';
import styles from '../../infrastructure/styles';

/**
 * SignUp Component
*/
class SignUp extends React.Component {
  state = {
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    confirmPassword: '',
    username: '',
    open: false,
    formErrors: {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      confirmPassword: '',
      username: ''
    },
    emailValid: false,
    firstnameValid: false,
    lastnameValid: false,
    passwordValid: false,
    confirmPasswordValid: false,
    usernameValid: false,
    formValid: false
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    errorMessage: PropTypes.string,
    signUpUser: PropTypes.func.isRequired
  }

  /**
   * handleInputChange
   * @param {object} event Event object
   * @returns {void}
   */
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState(
      { [name]: value },
      () => { this.validateField(name, value); }
    );
  };

  /**
   * validateField
   * @param {string} fieldName The input field name
   * @param {string} value Value entered into the input field
   * @returns {void}
   */
  validateField = (fieldName, value) => {
    const fieldValidationErrors = { ...this.state.formErrors };
    let {
      emailValid,
      passwordValid,
      confirmPasswordValid,
      firstnameValid,
      lastnameValid,
      usernameValid
    } = this.state;

    switch (fieldName) {
      case 'email':
        if (isEmpty(value)) {
          emailValid = false;
          fieldValidationErrors.email = 'Email is required';
        } else {
          emailValid = isEmail(value);
          fieldValidationErrors.email = emailValid ? '' : 'Email is invalid';
        }
        break;
      case 'firstname':
        if (isEmpty(value)) {
          firstnameValid = false;
          fieldValidationErrors.firstname = 'Firstname is required';
        } else {
          firstnameValid = isAlpha(value);
          fieldValidationErrors.firstname = firstnameValid ? '' : 'Firstname cannot contain numbers or special character';
        }
        break;
      case 'lastname':
        if (isEmpty(value)) {
          lastnameValid = false;
          fieldValidationErrors.lastname = 'Lastname is required';
        } else {
          lastnameValid = isAlpha(value);
          fieldValidationErrors.lastname = lastnameValid ? '' : 'Lastname cannot contain numbers or special character';
        }
        break;
      case 'username':
        if (isEmpty(value)) {
          usernameValid = false;
          fieldValidationErrors.username = 'Username is required';
        } else {
          usernameValid = true;
          fieldValidationErrors.username = usernameValid ? '' : 'Username is invalid';
        }
        break;
      case 'password':
        if (isEmpty(value)) {
          passwordValid = false;
          fieldValidationErrors.password = 'Password is required';
        } else {
          passwordValid = value.length >= 6;
          fieldValidationErrors.password = passwordValid ? '' : 'Password should be greater than 6 characters';
        }
        break;
      case 'confirmPassword':
        if (isEmpty(value)) {
          confirmPasswordValid = false;
          fieldValidationErrors.confirmPassword = 'Confirm Password is required';
        } else {
          confirmPasswordValid = !(value !== this.state.password);
          fieldValidationErrors.confirmPassword = confirmPasswordValid ? '' : 'Passwords do not match';
        }
        break;
      default:
        break;
    }

    this.setState({
      formErrors: fieldValidationErrors,
      emailValid,
      passwordValid,
      confirmPasswordValid,
      firstnameValid,
      lastnameValid,
      usernameValid
    }, this.validateForm);
  }

  /**
   * validateForm
   * @returns {void}
   */
  validateForm = () => {
    this.setState({
      formValid: this.state.emailValid
        && this.state.passwordValid
        && this.state.confirmPasswordValid
        && this.state.usernameValid
        && this.state.firstnameValid
        && this.state.lastnameValid
    });
  }

  /**
   * handleMouseDownPassword
   * @param {object} event Event object
   * @returns {void}
   */
  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  /**
   * handleClickShowPasssword
   * @returns {void}
   */
  handleClickShowPasssword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  /**
   * handleSubmit
   * @param {object} event Event object
   * @returns {void}
   */
  handleSubmit = (event) => {
    event.preventDefault();

    const {
      email,
      firstname,
      lastname,
      password,
      username
    } = this.state;

    // Set open to true to reveal snack bar in case of error
    this.setState({ open: true });
    this.props.signUpUser({
      email,
      firstname,
      lastname,
      password,
      username
    }, this.props.history);
  };

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
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={this.state.open}
        autoHideDuration={5000}
        onClose={this.handleClose}
        SnackbarContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id"><strong>Oops! </strong>{this.props.errorMessage}</span>}
      />
    </div>
  );

  /**
   * render - Renders a signin form
   * @returns {HTMLElement} Sign In Form
   */
  render() {
    const { classes, errorMessage } = this.props;
    const {
      confirmPassword,
      email,
      firstname,
      lastname,
      password,
      username
    } = this.state.formErrors;

    return (
      <Fragment>
        <Grid
          container
          spacing={24}
          direction="column"
          alignContent="center"
          alignItems="center"
          className={classes.signUpGrid}
        >
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="display2" component="h2">
                Sign up
              </Typography>
              <form
                className={classes.root}
                onSubmit={this.handleSubmit}
              >
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <Input
                    id="adornment-email"
                    value={this.state.email}
                    onChange={this.handleInputChange}
                    type="email"
                    name="email"
                    error={!isEmpty(email)}
                  />
                  { email &&
                    <FormHelperText id="email-helper-text">{email}</FormHelperText>
                  }
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel htmlFor="username">Username</InputLabel>
                  <Input
                    id="adornment-username"
                    value={this.state.username}
                    onChange={this.handleInputChange}
                    type="text"
                    name="username"
                    error={!isEmpty(username)}
                  />
                  { username &&
                    <FormHelperText id="username-helper-text">{username}</FormHelperText>
                  }
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel htmlFor="firstname">Firstname</InputLabel>
                  <Input
                    id="adornment-firstname"
                    value={this.state.firstname}
                    onChange={this.handleInputChange}
                    type="text"
                    name="firstname"
                    error={!isEmpty(firstname)}
                  />
                  { firstname &&
                    <FormHelperText id="firstname-helper-text">{firstname}</FormHelperText>
                  }
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel htmlFor="lastname">Lastname</InputLabel>
                  <Input
                    id="adornment-lastname"
                    value={this.state.lastname}
                    onChange={this.handleInputChange}
                    type="text"
                    name="lastname"
                    error={!isEmpty(lastname)}
                  />
                  { lastname &&
                    <FormHelperText id="lastname-helper-text">{lastname}</FormHelperText>
                  }
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    id="adornment-password"
                    type={this.state.showPassword ? 'text' : 'password'}
                    name="password"
                    error={!isEmpty(password)}
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={this.handleClickShowPasssword}
                          onMouseDown={this.handleMouseDownPassword}
                        >
                          {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  { password &&
                    <FormHelperText id="password-helper-text">{password}</FormHelperText>
                  }
                </FormControl>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                  <Input
                    id="adornment-confirmPassword"
                    type="password"
                    name="confirmPassword"
                    error={!isEmpty(confirmPassword)}
                    value={this.state.confirmPassword}
                    onChange={this.handleInputChange}
                  />
                  { confirmPassword &&
                    <FormHelperText id="confirmPassword-helper-text">{confirmPassword}</FormHelperText>
                  }
                </FormControl>
                <FormControl>
                  <Button
                    variant="raised"
                    color="primary"
                    className={classes.button}
                    type="submit"
                    disabled={!this.state.formValid}
                  >
                    Sign Up
                  </Button>
                </FormControl>
              </form>
              { errorMessage && this.renderAlert() }
            </CardContent>
          </Card>
        </Grid>
      </Fragment>
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

export default withRouter(connect(mapStateToProps, actions)(withStyles(styles)(SignUp)));
