import axios from 'axios';

import {
  AUTH_ERROR,
  AUTH_USER,
  UNAUTH_USER
} from './actionTypes';

/**
 *
 * @param {object} error Error object
 * @returns {object} action
 */
export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

/**
 *
 * @param {object} userData User's email and password
 * @param {object} browserHistory Browser history
 * @returns {func} Function
 */
export function signInUser(userData, browserHistory) {
  const url = '/v1/auth/signin';

  return dispatch => axios.post(url, userData)
    .then((response) => {
      dispatch({ type: AUTH_USER });
      const user = {
        ...response.data.user,
        accessToken: response.data.token
      };
      localStorage.setItem('cUser', JSON.stringify(user));
      browserHistory.push('/');
    })
    .catch((error) => {
      if (error.response) {
        dispatch(authError(error.response.data.message));
      } else {
        dispatch(authError('Bad Login Info'));
      }
    });
}

/**
 *
 * @param {object} userData User's email, password,
 * username, firstname, and lastname
 * @param {object} browserHistory Browser history
 * @returns {func} Function
 */
export function signUpUser(userData, browserHistory) {
  const url = '/v1/auth/signup';

  return dispatch => axios.post(url, userData)
    .then((response) => {
      const user = {
        ...response.data.user,
        accessToken: response.data.token
      };
      localStorage.setItem('cUser', JSON.stringify(user));
      browserHistory.push('/');
    })
    .catch((error) => {
      if (error.response) {
        dispatch(authError(error.response.data.message));
      } else {
        dispatch(authError('Sign up failed'));
      }
    });
}

/**
 *
 * @param {object} userData User's email and password
 * @returns {object} action
 */
export function signOutUser() {
  localStorage.removeItem('cUser');

  return { type: UNAUTH_USER };
}
