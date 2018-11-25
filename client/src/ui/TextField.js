import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

// Material UI
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';

const TextField = ({
  input,
  label,
  type,
  meta: { touched, error },
  ...custom
}) => (
  <Fragment>
    <Input {...input} type={type} {...custom} />
    { touched &&
      ((<FormHelperText id={`${label}-helper-text`}>{error}</FormHelperText>) ||
      (<FormHelperText id={`${label}-helper-text`}>{error}</FormHelperText>))
    }
  </Fragment>
);

TextField.propTypes = {
  input: PropTypes.any,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
};

export default TextField;
