import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import { withStyles } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/Warning';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import styles from '../infrastructure/styles';

const variantIcon = {
  error: ErrorIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
};

const SnackbarContentProps = ({ classes, className, message, onClose, variant, ...other }) => {
  const Icon = variantIcon[variant];
  const Action = (
    <IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={onClose}>
      <CloseIcon className={classes.icon} />
    </IconButton>
  );
  const Message = (
    <span id="client-snackbar" className={classes.message}>
      <Icon className={classNames(classes.icon, classes.iconVariant)} />
      {message}
    </span>
  );

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={Message}
      action={[Action]}
      {...other}
    />
  );
};

SnackbarContentProps.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

export default withStyles(styles)(SnackbarContentProps);
