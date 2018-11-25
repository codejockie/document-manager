import { isEmail } from 'validator';

export default (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!isEmail(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length <= 6) {
    errors.password = 'Password must be more than 6 characters long';
  }
  return errors;
};
