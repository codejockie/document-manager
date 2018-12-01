import { isAlpha, isEmail } from 'validator';

export default (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!isEmail(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.username) {
    errors.username = 'Username is required';
  }
  if (!values.firstname) {
    errors.firstname = 'Firstname is required';
  } else if (!isAlpha(values.firstname)) {
    errors.firstname = 'Firstname cannot contain numbers or special characters';
  }
  if (!values.lastname) {
    errors.lastname = 'Lastname is required';
  } else if (!isAlpha(values.lastname)) {
    errors.lastname = 'Lastname cannot contain numbers or special characters';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length <= 6) {
    errors.password = 'Password must be more than 6 characters long';
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm Password is required';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }
  return errors;
};
