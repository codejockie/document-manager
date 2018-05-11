import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import Root from './components/Root';
import reducers from './reducers';
import { AUTH_USER } from './actions/actionTypes';

const logger = createLogger({
  // ...options
});
const middlewares = [
  reduxThunk
];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(...middlewares))
);

const user = JSON.parse(localStorage.getItem('cUser'));

if (user && user.accessToken) {
  store.dispatch({ type: AUTH_USER });
}

render(
  <Root store={store} />,
  document.querySelector('#content')
);
