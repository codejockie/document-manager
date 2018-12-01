import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import styles from '../infrastructure/styles';

import * as actions from '../actions/auth';

/**
 * Header component
 */
export class Header extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    signOutUser: PropTypes.func.isRequired
  };

  /**
   * Render links based on auth state
   * @returns {HTMLElement} Links
   */
  renderLinks = () => {
    if (!this.props.authenticated) {
      return (
        <Fragment>
          <Button
            color="inherit"
            component={Link}
            to="/auth/signin"
          >
            Sign In
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/auth/signup"
          >
            Sign Up
          </Button>
        </Fragment>
      );
    }
    return (
      <Button
        color="inherit"
        onClick={() => this.props.signOutUser()}
      >
        Sign Out
      </Button>
    );
  }

  /**
   * Render page navigation bar
   * @returns {HTMLElement} AppBar
   */
  render() {
    const { classes } = this.props;
    return (
      <AppBar position="sticky" className={classes.appBar}>
        <nav>
          <Toolbar>
            <Typography
              className={classes.flex}
              color="inherit"
              component={Link}
              to="/" variant="h6"
            >
              Docs
            </Typography>
            {this.renderLinks()}
          </Toolbar>
        </nav>
      </AppBar>
    );
  }
}

/**
   * mapStateToProps - Maps redux state date to props
   * for Header component
   * @param {string} authenticated Auth state
   * @returns {object} state.errorMessage
   */
function mapStateToProps({ auth: { authenticated } }) {
  return {
    authenticated
  };
}

export default connect(mapStateToProps, actions)(withStyles(styles)(Header));
