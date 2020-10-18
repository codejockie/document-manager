import configureMockStore from 'redux-mock-store';
import moxios from 'moxios';
import thunk from 'redux-thunk';

import * as actions from '@/actions/auth';
import * as actionTypes from '@/actions/actionTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const EMAIL = 'jk@jk.com';
const PASSWORD = 'testing';

describe('Auth Actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('Sign In', () => {
    it('dispatches AUTH_USER after successful authentication', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            data: {
              user: {},
              token: 'jdjjf133aafnffn'
            }
          },
        });
      });

      const expectedActions = [
        { type: actionTypes.AUTH_USER },
        { type: actionTypes.AUTH_ERROR, payload: 'Bad Login Info' }
      ];

      const store = mockStore({ auth: {} });

      return store.dispatch(actions.signInUser({ email: EMAIL, password: PASSWORD })).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches AUTH_ERROR on failed authentication', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 500,
          response: {},
        });
      });

      const expectedActions = [
        { payload: 'Username or Password incorrect', type: actionTypes.AUTH_ERROR }
      ];

      const store = mockStore({ auth: {} });

      return store.dispatch(actions.signInUser({ email: EMAIL, password: PASSWORD })).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('Sign Up', () => {
    it('dispatches AUTH_USER after successful registration', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            data: {
              user: {},
              token: 'jdjjf133aafnffn'
            }
          },
        });
      });

      const expectedActions = [
        { type: actionTypes.AUTH_ERROR, payload: 'Sign up failed' }
      ];

      const store = mockStore({ auth: {} });

      return store.dispatch(actions.signUpUser({ email: EMAIL, password: PASSWORD })).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches AUTH_ERROR on failed registration', () => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 500,
          response: {},
        });
      });

      const expectedActions = [
        { type: actionTypes.AUTH_ERROR }
      ];

      const store = mockStore({ auth: {} });

      return store.dispatch(actions.signUpUser({ email: EMAIL, password: PASSWORD })).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('Sign Out', () => {
    it('dispatches UNAUTH_USER on sign out', () => {
      const expectedActions = [
        { type: actionTypes.UNAUTH_USER }
      ];

      const store = mockStore({ auth: {} });

      store.dispatch(actions.signOutUser());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
