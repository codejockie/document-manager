import React, { Fragment } from 'react';

import Routes from './Routes';
import ConnectedHeader from '../containers/Header';

import '../styles/App.scss';

const App = () => (
  <Fragment>
    <ConnectedHeader />
    <Routes />
  </Fragment>
);

export default App;
