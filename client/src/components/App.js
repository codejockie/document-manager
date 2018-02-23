import React, { Fragment } from 'react';

import Main from './Main';
import Header from '../containers/Header';

import '../styles/App.scss';

const App = () => (
  <Fragment>
    <Header />
    <Main />
  </Fragment>
);

export default App;
