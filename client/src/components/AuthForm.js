import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Field, reduxForm } from 'redux-form';

// Material-UI component imports
import {
  Button, Card, CardContent, FormControl, Grid,
  IconButton, InputAdornment, Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import TextField from 'common/TextField';
import styles from 'infrastructure/styles';
import validate from 'infrastructure/Validate';

const SIGN_IN = 'Sign In';
const SIGN_UP = 'Sign Up';

const AuthForm = ({ classes, handleSubmit, isRegistration, submitting }) => {
  const controlText = isRegistration ? SIGN_UP : SIGN_IN;
  const [visible, setVisible] = useState(false);

  return (
    <Fragment>
      <Grid container spacing={4} direction="column" alignContent="center" alignItems="center" className={classes.grid}>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h2" component="h2">
              {controlText}
            </Typography>
            <form className={classes.root} onSubmit={handleSubmit}>
              <FormControl fullWidth className={classes.formControl}>
                <Field name="email" component={TextField} type="email" label="Email" />
              </FormControl>
              {
                isRegistration && (
                  <>
                      <FormControl fullWidth className={classes.formControl}>
                        <Field name="username" component={TextField} type="text" label="Username" />
                      </FormControl>
                      <FormControl fullWidth className={classes.formControl}>
                        <Field name="firstname" component={TextField} type="text" label="Firstname" />
                      </FormControl>
                      <FormControl fullWidth className={classes.formControl}>
                        <Field name="lastname" component={TextField} type="text" label="Lastname" />
                      </FormControl>
                  </>
                )
              }
              <FormControl fullWidth className={classes.formControl}>
                <Field
                  name="password"
                  component={TextField}
                  type={visible ? 'text' : 'password'}
                  label="Password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={() => setVisible(!visible)} onMouseDown={(event) => { event.preventDefault(); }}>
                        {visible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  } />
              </FormControl>
              {
                isRegistration && (
                  <FormControl fullWidth className={classes.formControl}>
                    <Field name="confirmPassword" component={TextField} type="password" label="Confirm Password" />
                  </FormControl>
                )
              }
              <FormControl fullWidth>
                <Button variant="contained" color="primary" className={classes.button} type="submit" disabled={submitting}>
                  {controlText}
                </Button>
              </FormControl>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Fragment>
  );
};

AuthForm.propTypes = {
  classes: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  isRegistration: PropTypes.bool,
  submitting: PropTypes.bool
};

export default form => reduxForm({ form, validate })(withStyles(styles)(AuthForm));
