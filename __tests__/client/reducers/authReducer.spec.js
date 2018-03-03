import reducer from '../../../client/src/reducers/authReducer';
import * as actionTypes from '../../../client/src/actions/actionTypes';

describe('Auth Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle AUTH_USER', () => {
    const authAction = {
      type: actionTypes.AUTH_USER
    };

    expect(reducer({}, authAction)).toEqual({
      authenticated: true,
      error: ''
    });
  });

  it('should handle UNAUTH_USER', () => {
    const unauthAction = {
      type: actionTypes.UNAUTH_USER
    };

    expect(reducer({}, unauthAction)).toEqual({
      authenticated: false,
      error: ''
    });
  });

  it('should handle AUTH_ERROR', () => {
    const errorAction = {
      type: actionTypes.AUTH_ERROR,
      payload: 'Auth failed'
    };

    expect(reducer({}, errorAction)).toEqual({
      error: 'Auth failed'
    });
  });
});
