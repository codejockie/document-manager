import axios from 'axios';

import { AUTH_USER, AUTH_ERROR } from '../actions/actionTypes';

/**
 *
 * @param {object} error Error object
 * @returns {object} Payload
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
 * @param {object} history Browser history
 * @returns {func} Function
 */
export function signInUser(userData, history) {
  const url = '/v1/auth/signin';

  return (dispatch) => {
    axios.post(url, userData)
      .then((response) => {
        dispatch({ type: AUTH_USER });
        const user = {
          ...response.data.user,
          accessToken: response.data.token
        };
        localStorage.setItem('cUser', JSON.stringify(user));
        history.push('/');
      })
      .catch(() => {
        dispatch(authError('Bad Login Info'));
      });
  };
}
