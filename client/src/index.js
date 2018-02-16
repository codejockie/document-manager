import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import Root from './components/Root';
import reducers from './reducers';
import { AUTH_USER } from './actions/actionTypes';

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(reduxThunk))
);

const user = JSON.parse(localStorage.getItem('cUser'));

if (user && user.accessToken) {
  store.dispatch({ type: AUTH_USER });
}

render(
  <Root store={store} />,
  document.querySelector('#content')
);
