import axios from 'axios';

import {
  AUTH_USER,
  SAVE_TOKEN,
  TOKEN_EXPIRED,
  UNAUTH_USER,
  VERIFY_TOKEN
} from '../actions/actionTypes';

export const getToken = () => localStorage.getItem('authToken');
export const setToken = (key, token) => {
  localStorage.setItem(key, token);
};
export const removeFromStorage = (key) => {
  localStorage.removeItem(key);
};

/* eslint-disable no-unused-vars */
export const persistToken = store => next => (action) => {
  switch (action.type) {
    case VERIFY_TOKEN:
      axios({
        url: '/v1/auth/verify',
        method: 'POST',
        data: {
          token: getToken()
        }
      }).then(({ data: { error, ok } }) => {
        if (!ok) {
          next({
            type: TOKEN_EXPIRED,
            error
          });
          return;
        }

        store.dispatch({ type: AUTH_USER });
        next({
          type: SAVE_TOKEN,
          token: getToken()
        });
      });
      break;
    case SAVE_TOKEN:
      setToken('authToken', action.token);
      break;
    case TOKEN_EXPIRED:
      removeFromStorage('authUser');
      removeFromStorage('authToken');
      store.dispatch({ type: UNAUTH_USER, error: action.error });
      break;
    default:
      break;
  }

  next(action);
};
