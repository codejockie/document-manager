import ConnectedHeader, { Header } from '../../../client/src/containers/Header';
import Helpers from '../helpers';

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
      const { component } = Helpers.setup(ConnectedHeader, { initialState });
      expect(component.find('button').length).toEqual(1);
      expect(component.find('button').text()).toEqual('Sign Out');
    });

    it('given an authenticated user, it clicks the sign out button', () => {
      const signOutUserMock = jest.fn();
      const props = { authenticated: true, signOutUser: signOutUserMock };
      const { component } = Helpers.setup(Header, { initialState, props });
      expect(component.find('button').length).toEqual(1);
      component.find('button').simulate('click');
      expect(signOutUserMock).toHaveBeenCalled();
    });

    it('given an unauthenticated user, it renders sign in and sign up links', () => {
      const { component } = Helpers.setup(ConnectedHeader, { initialState });
      expect(component.find('a').length).toEqual(3);
    });
  });
});
