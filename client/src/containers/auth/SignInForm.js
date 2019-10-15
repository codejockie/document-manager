import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';

// Material-UI component imports
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import styles from '../../infrastructure/styles';
import TextField from '../../ui/TextField';
import validate from '../../infrastructure/Validate';

const SignInForm = ({ classes, handleSubmit, isPasswordVisible, showPasssword, submitting }) => (
  <Fragment>
    <Grid container spacing={4} direction="column" alignContent="center" alignItems="center" className={classes.grid}>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h2" component="h2">Sign in</Typography>
          <form className={classes.root} onSubmit={handleSubmit}>
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Field name="email" component={TextField} type="email" label="Email" />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Field
                name="password"
                component={TextField}
                label="Password"
                type={isPasswordVisible ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={showPasssword} onMouseDown={(event) => { event.preventDefault(); }}>
                      {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl>
              <Button variant="contained" color="primary" className={classes.button} type="submit" disabled={submitting}>
                Sign In
              </Button>
            </FormControl>
          </form>
        </CardContent>
      </Card>
    </Grid>
  </Fragment>
);

SignInForm.propTypes = {
  classes: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  isPasswordVisible: PropTypes.bool.isRequired,
  showPasssword: PropTypes.func.isRequired,
  submitting: PropTypes.bool
};

export default reduxForm({ form: 'signin', validate })(withStyles(styles)(SignInForm));
