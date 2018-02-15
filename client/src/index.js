import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import Root from './components/Root';
import reducers from './reducers';

const storeWithMiddleware = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(reduxThunk))
);

render(
  <Root store={storeWithMiddleware} />,
  document.querySelector('#content')
);
