import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ConnectedHeader from '../../../client/src/containers/Header';
import Helpers from '../helpers';

configure({ adapter: new Adapter() });

const initialState = {
  auth: { authenticated: false }
};

describe('Components', () => {
  describe('Header', () => {
    afterEach(() => {
      initialState.auth.authenticated = false;
    });

    it('given an authenticated user, it renders a sign out link', () => {
      initialState.auth.authenticated = true;
      const { component } = Helpers.setup(ConnectedHeader, initialState);
      expect(component.find('a').length).toEqual(2);
    });

    it('given an unauthenticated user, it renders sign in and sign up links', () => {
      const { component } = Helpers.setup(ConnectedHeader, initialState);
      expect(component.find('a').length).toEqual(3);
    });
  });
});
