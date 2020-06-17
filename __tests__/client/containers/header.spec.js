import { MenuItem } from '@material-ui/core';
import { createMatchMedia, setup } from '../helpers';
import ConnectedHeader, { Header } from '@/containers/Header';

const initialState = {
  auth: { authenticated: false }
};

describe('Components', () => {
  describe('Header', () => {
    beforeAll(() => {
      window.matchMedia = createMatchMedia(window.innerWidth);
    });

    afterEach(() => {
      initialState.auth.authenticated = false;
    });

    it('given an authenticated user, it clicks the sign out button', () => {
      const signOutUserMock = jest.fn();
      const props = { authenticated: true, signOutUser: signOutUserMock };
      const component = setup(Header, { initialState, props });
      expect(component.find('button').length).toEqual(1);

      // Find MenuItem
      component.find('button').simulate('click');
      const menuItems = component.find(MenuItem);
      expect(menuItems.length).toEqual(2);

      // Click the Profile menu item
      const profile = menuItems.at(0);
      profile.simulate('click');
      expect(profile.text()).toEqual('Profile');

      // Click the Logout menu item
      const logout = menuItems.at(1);
      logout.simulate('click');
      expect(logout.text()).toEqual('Logout');
      expect(signOutUserMock).toHaveBeenCalled();
    });

    it('given an unauthenticated user, it renders sign in and sign up links', () => {
      const component = setup(ConnectedHeader, { initialState });
      const anchorTags = component.find('a');
      expect(anchorTags.length).toEqual(3);
      expect(anchorTags.at(1).text()).toEqual('Sign In');
      expect(anchorTags.at(2).text()).toEqual('Sign Up');
    });
  });
});
