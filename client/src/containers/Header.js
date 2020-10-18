import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import { AccountCircle, Menu as MenuIcon } from '@material-ui/icons';
import { AppBar, Button, Divider, Hidden, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';

import * as actions from 'actions/auth';
import styles from 'infrastructure/styles';

/**
 * Header component
 */
export class Header extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    signOutUser: PropTypes.func.isRequired
  };

  state = {
    anchorEl: null
  };

  /**
   * Handle menu open state
   * @param {Event} event
   * @returns {void}
   */
  handleMenuClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };


  /**
   * Handle close of menu
   * @returns {void}
   */
  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  /**
   * Render page navigation bar
   * @returns {HTMLElement} AppBar
   */
  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const { authenticated, classes, signOutUser } = this.props;

    return (
      <AppBar position="sticky" className={classes.appBar} color="secondary">
        <Toolbar>
          <Hidden smUp>
            {/* TODO: Make into a reusable component */}
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={this.handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                <Divider />
                <MenuItem onClick={signOutUser}>Logout</MenuItem>
              </Menu>
          </Hidden>
          <Typography className={classes.title} color="inherit" component={Link} to="/" variant="h6">
            Docs
          </Typography>
          {!authenticated && (
            <>
              <Button color="inherit" component={Link} to="/signin">Sign In</Button>
              <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
            </>
          )}
          {authenticated && (
            <Hidden xsDown>
              <IconButton
                aria-label="account of current user"
                aria-controls="profile-appbar"
                aria-haspopup="true"
                onClick={this.handleMenuClick}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="profile-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                <MenuItem onClick={signOutUser}>Logout</MenuItem>
              </Menu>
            </Hidden>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

export default connect(state => ({
  authenticated: state.auth.authenticated,
}), actions)(withStyles(styles)(Header));
