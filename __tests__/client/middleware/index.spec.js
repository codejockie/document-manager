import moxios from 'moxios';

import { persistToken } from '@/middleware';
import { AUTH_USER, SAVE_TOKEN, TOKEN_EXPIRED, UNAUTH_USER, VERIFY_TOKEN } from '@/actions/actionTypes';

const next = jest.fn();
const dispatch = jest.fn();
const getState = jest.fn(() => ({}));

const create = () => {
  const store = { dispatch, getState };
  const invoke = action => persistToken(store)(next)(action);

  return { invoke };
};

describe('persistToken Middleware', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    next.mockReset();
    dispatch.mockReset();
    getState.mockReset();
    moxios.uninstall();
  });

  it('passes through non-function action', () => {
    const { invoke } = create();
    const action = { type: 'TEST' };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('saves the token', () => {
    const { invoke } = create();
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
        data: { error: '', ok: true },
      },
    });

    const action = { token, type: VERIFY_TOKEN };
    persistToken({ dispatch })(next)(action);

    moxios.wait(() => {
      expect(next).toHaveBeenCalledWith(action);
      expect(dispatch).toHaveBeenCalledWith({ type: AUTH_USER });
    });
  });

  it('it dispatches TOKEN_EXPIRED on invalid/expired token', () => {
    moxios.stubRequest('/v1/auth/verify', {
      status: 401,
      response: {
        data: {
          error: 'Invalid Token',
          ok: false,
        },
      },
    });

    const { invoke } = create();
    const action = { type: VERIFY_TOKEN };
    invoke(action);

    moxios.wait(() => {
      expect(next).toHaveBeenCalledWith(action);
      expect(dispatch).toHaveBeenCalledWith({ type: TOKEN_EXPIRED });
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
            ok: false,
          },
        },
      });
    });

    const { invoke } = create();
    const error = 'Token Expired';
    const action = { type: TOKEN_EXPIRED, error };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
    expect(dispatch).toHaveBeenCalledWith({ type: UNAUTH_USER, error });
  });
});
