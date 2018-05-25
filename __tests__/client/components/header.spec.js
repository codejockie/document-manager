import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import ConnectedHeader from '../../../client/src/containers/Header';

configure({ adapter: new Adapter() });

const middlewares = [];
const initialState = {
  auth: { authenticated: false }
};

/**
 * @param { object } Component React component
 * @returns { object } props and wrapper
 */
function setup(Component) {
  const mockStore = configureStore(middlewares);
  const store = mockStore(initialState);

  const wrapper = mount((
    <BrowserRouter>
      <Component store={store} />
    </BrowserRouter>
  ));

  return {
    wrapper
  };
}

describe('Components', () => {
  describe('Header', () => {
    it('should render links based on auth state', () => {
      const { wrapper } = setup(ConnectedHeader);
      expect(wrapper.find('button').length).toEqual(1);
    });

    it('should render sign in and sign up links', () => {
      const mockStore = configureStore(middlewares);
      const store = mockStore({ auth: { authenticated: true } });
      const wrapper = mount((
        <BrowserRouter>
          <ConnectedHeader store={store} />
        </BrowserRouter>
      ));

      expect(wrapper.find('button').length).toEqual(1);
    });
  });
});
