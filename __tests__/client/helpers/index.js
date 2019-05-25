import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';
import { withStyles } from '@material-ui/core/styles';

import styles from './styles';

configure({ adapter: new Adapter() });

const wrapRouter = (Component, initialState, props) => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  const store = mockStore(initialState);
  // Wrap component with Material UI styling
  const Composition = withStyles(styles)(Component);
  return (
    <BrowserRouter>
      <Composition store={store} {...props} />
    </BrowserRouter>
  );
};

/**
 * @param { object } Component React component
 * @param { object } options Options to configure component rendering
 * @returns { object } props and component
 */
function setup(Component, options) {
  const { initialState = {}, props = {}, isShallow = false } = options;
  const component = isShallow
    ? shallow(wrapRouter(Component, initialState, props))
    : mount(wrapRouter(Component, initialState, props));

  return {
    component
  };
}

export default {
  setup
};
