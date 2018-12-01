import React, { Fragment } from 'react';

import Main from './Routes';
import ConnectedHeader from '../containers/Header';

import '../styles/App.scss';

const App = () => (
  <Fragment>
    <ConnectedHeader />
    <Main />
  </Fragment>
);

export default App;
