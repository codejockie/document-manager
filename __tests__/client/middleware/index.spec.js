import moxios from 'moxios';

import { persistToken } from '../../../client/src/middleware';
import {
  AUTH_USER,
  SAVE_TOKEN,
  TOKEN_EXPIRED,
  UNAUTH_USER,
  VERIFY_TOKEN
} from '../../../client/src/actions/actionTypes';

const create = () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
  };
  const next = jest.fn();

  const invoke = action => persistToken(store)(next)(action);

  return { store, next, invoke };
};

describe('persistToken Middleware', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('passes through non-function action', () => {
    const { next, invoke } = create();
    const action = { type: 'TEST' };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('saves the token', () => {
    const { invoke, next } = create();
    const token = 'test_token001';
    const action = { type: SAVE_TOKEN, token };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
    expect(localStorage.getItem('authToken')).toEqual(token);
  });

  it('it dispatches SAVE_TOKEN on valid token', () => {
    const token = 'test_token002';
    localStorage.setItem('authToken', token);
    moxios.stubRequest('/v1/auth/verify', {
      status: 200,
      response: {
        data: {
          error: '',
          ok: true
        }
      }
    });

    const { invoke, next, store } = create();
    const action = { type: VERIFY_TOKEN, token };
    invoke(action);

    moxios.wait(() => {
      expect(next).toHaveBeenCalledWith(action);
      expect(store.dispatch).toHaveBeenCalledWith({ type: AUTH_USER });
      expect(next).toHaveBeenCalledWith({ type: SAVE_TOKEN, token });
    });
  });

  it('it dispatches TOKEN_EXPIRED on invalid/expired token', () => {
    moxios.stubRequest('/v1/auth/verify', {
      status: 401,
      response: {
        data: {
          error: 'Invalid Token',
          ok: false
        }
      }
    });

    const { invoke, next, store } = create();
    const action = { type: VERIFY_TOKEN };
    invoke(action);

    moxios.wait(() => {
      expect(next).toHaveBeenCalledWith(action);
      expect(store.dispatch).toHaveBeenCalledWith({ type: TOKEN_EXPIRED });
    });
  });

  it('it dispatches TOKEN_EXPIRED', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 401,
        response: {
          data: {
            error: 'Token Expired',
            ok: false
          }
        },
      });
    });

    const { invoke, next, store } = create();
    const error = 'Token Expired';
    const action = { type: TOKEN_EXPIRED, error };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
    expect(store.dispatch).toHaveBeenCalledWith({ type: UNAUTH_USER, error });
  });
});
