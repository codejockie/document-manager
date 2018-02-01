import { render } from 'react-dom';
import React from 'react';

const App = () => (<div>Hello World!</div>);

render(
  <App />,
  document.querySelector('#content')
);
