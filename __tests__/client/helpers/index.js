import React from 'react';
import { configure } from 'enzyme';
import mediaQuery from 'css-mediaquery';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import { createMount, createShallow } from '@material-ui/core/test-utils';
import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core/styles';

import styles from '@/infrastructure/styles';

configure({ adapter: new Adapter() });

// Create theme with initial width
const theme = createMuiTheme({ props: { MuiWithWidth: { initialWidth: 'xs' } } });

const wrapRouter = (Component, initialState, props) => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  const store = mockStore(initialState);
  // Wrap component with Material UI styling
  const Composition = withStyles(styles)(Component);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Composition store={store} {...props} />
      </ThemeProvider>
    </BrowserRouter>
  );
};

/**
 * @param { React.ComponentType } component React component
 * @param { object } options Options to configure component rendering
 * @returns { object } props and component
 */
export function setup(component, options) {
  const { initialState = {}, props = {}, isShallow = false } = options;
  const mount = createMount();
  const shallow = createShallow();

  return isShallow
    ? shallow(wrapRouter(component, initialState, props))
    : mount(wrapRouter(component, initialState, props));
}

/**
 * @param { object } width window width
 * @returns { Function } media query
 */
export function createMatchMedia(width) {
  return query => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {},
  });
}
