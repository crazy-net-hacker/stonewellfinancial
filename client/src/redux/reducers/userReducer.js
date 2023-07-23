import {
  SIGNUP_REQUESTED,
  SIGNUP_REQUEST_SUCCESS,
  SIGNUP_REQUEST_FAILED,
  SIGNUP_STATE_CLEAR,
  SIGNIN_REQUESTED,
  SIGNIN_REQUEST_SUCCESS,
  SIGNIN_REQUEST_FAILED,
  SIGNIN_STATE_CLEAR,
  USER_LOGOUT,
  VERIFY_USER_REQUESTED,
  VERIFY_USER_REQUEST_SUCCESS,
  VERIFY_USER_REQUEST_FAILED,
  CHANGE_PASSWORD_REQUESTED,
  CHANGE_PASSWORD_REQUEST_SUCCESS,
  CHANGE_PASSWORD_REQUEST_FAILED,
  GET_USERS_BY_VENDOR_REQUESTED,
  GET_USERS_BY_VENDOR_SUCCESS,
  GET_USERS_BY_VENDOR_FAILED

} from '../types'

export const initialState = {
  users: [],
  signUpInfo: [],
  signInInfo: [],
  isAuthenticated: false,
  loading: true,
  error: false,
}

// Sign-up
export function signUpReducer(
  state = { signUpInfo: [], loading: true },
  action
) {
  switch (action.type) {
    case SIGNUP_REQUESTED:
      return {
        signUpInfo: [],
        loading: true,
      }
    case SIGNUP_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        signUpInfo: action.payload,
        error: false,
      }
    case SIGNUP_REQUEST_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
        signUpInfo: false,
      }
    case USER_LOGOUT:
    case SIGNUP_STATE_CLEAR:
      return {
        loading: false,
        error: false,
        signUpInfo: false,
        isAuthenticated: false,
      }

    default:
      return state
  }
}

// Sign-in
export function signInReducer(state = initialState, action) {
  switch (action.type) {
    case SIGNIN_REQUESTED:
      return {
        loading: true,
        email: action.email,
        password: action.password,
      }
    case SIGNIN_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        signInInfo: action.payload,
        error: false,
      }
    case SIGNIN_REQUEST_FAILED:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        error: action.payload,
        signInInfo: false,
      }
    case USER_LOGOUT:
    case SIGNIN_STATE_CLEAR:
      return {
        loading: false,
        error: false,
        signInInfo: false,
        isAuthenticated: false,
      }
    default:
      return state
  }
}

// reset Password
export function resetPasswordReducer(state = initialState, action) {
  switch (action.type) {
    // Verify user
    case VERIFY_USER_REQUESTED:
      return {
        loading: true
      }
    case VERIFY_USER_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        // isAuthenticated: true,
        users: action.payload,
        error: false,
      }
    case VERIFY_USER_REQUEST_FAILED:
      return {
        ...state,
        loading: false,
        // isAuthenticated: false,
        error: action.payload,
        users: false,
      }
    // change password
    case CHANGE_PASSWORD_REQUESTED:
      return {
        loading: true
      }
    case CHANGE_PASSWORD_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        // isAuthenticated: true,
        users: action.payload,
        error: false,
      }
    case CHANGE_PASSWORD_REQUEST_FAILED:
      return {
        ...state,
        loading: false,
        // isAuthenticated: false,
        error: action.payload,
        users: false,
      }      
    default:
      return state
  }
}


export function userAccountReducer(state = initialState, action) {
  switch (action.type) {
      // Get a vendor account by access code
      case GET_USERS_BY_VENDOR_REQUESTED: 
      return {
        ...state,
        loading: true,
      }
    case GET_USERS_BY_VENDOR_SUCCESS: 
      return {
        ...state,
        loading: false,
        users: action.users,
      }
    case GET_USERS_BY_VENDOR_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message
      }      
    default:
      return state
  }
}

