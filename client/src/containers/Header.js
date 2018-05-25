import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// Material-UI imports
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

import styles from '../infrastructure/styles';

/**
 * Header component
 */
export class Header extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired
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
        component={Link}
        to="/signout"
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
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography
              className={classes.flex}
              color="inherit"
              component={Link}
              to="/" variant="title"
            >
              CJDocs
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

export default connect(mapStateToProps)(withStyles(styles)(Header));
