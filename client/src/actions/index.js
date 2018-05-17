import axios from 'axios';

import {
  AUTH_ERROR,
  AUTH_USER,
  UNAUTH_USER
} from './actionTypes';
import { removeFromStorage, setToken } from '../middleware';

/**
 * Handles error
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
 * Handles user sign in
 * @param {object} userData User's email and password
 * @param {object} browserHistory Browser history
 * @returns {func} Function
 */
export function signInUser(userData, browserHistory) {
  const url = '/v1/auth/signin';

  return dispatch => axios.post(url, userData)
    .then((response) => {
      dispatch({ type: AUTH_USER });
      const { user, token } = response.data;
      setToken('authUser', JSON.stringify(user));
      setToken('authToken', token);
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
 * Handles user sign up
 * @param {object} userData User's email, password,
 * username, firstname, and lastname
 * @param {object} browserHistory Browser history
 * @returns {func} Function
 */
export function signUpUser(userData, browserHistory) {
  const url = '/v1/auth/signup';

  return dispatch => axios.post(url, userData)
    .then((response) => {
      const { user, token } = response.data;
      setToken('authUser', JSON.stringify(user));
      setToken('authToken', token);
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
 * Handles user sign out
 * @param {object} userData User's email and password
 * @returns {object} action
 */
export function signOutUser() {
  removeFromStorage('authUser');
  removeFromStorage('authToken');

  return { type: UNAUTH_USER };
}
