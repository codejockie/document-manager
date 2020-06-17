import React, { Fragment } from 'react';

import Routes from 'components/Routes';
import Header from 'containers/Header';
import 'styles/App.scss';

const App = () => (
  <Fragment>
    <Header />
    <Routes />
  </Fragment>
);

export default App;
