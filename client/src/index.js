import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import Root from './components/Root';
import reducers from './reducers';
import { VERIFY_TOKEN } from './actions/actionTypes';
import { getToken, persistToken } from './middleware';

const logger = createLogger({
  // ...options
});
const middlewares = [
  reduxThunk,
  persistToken
];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(...middlewares))
);

const authToken = getToken();

if (authToken) {
  store.dispatch({ type: VERIFY_TOKEN });
}


render(
  <Root store={store} />,
  document.querySelector('#content')
);
