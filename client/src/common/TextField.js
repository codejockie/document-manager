import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

// Material UI
import { TextField } from '@material-ui/core';

const TextInput = ({ input, label, type, meta: { touched, error }, ...inputProps }) => (
  <Fragment>
    <TextField
        error={touched && Boolean(error)}
        id={`${label}-helper-text`}
        InputProps={{ ...inputProps }}
        label={label}
        helperText={touched && error}
        size="small"
        type={type}
        variant="outlined"
        {...input}
      />
  </Fragment>
);

TextInput.propTypes = {
  input: PropTypes.any,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};

export default TextInput;
