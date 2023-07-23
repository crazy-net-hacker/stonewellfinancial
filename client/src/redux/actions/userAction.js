import {
  SIGNUP_REQUESTED,
  SIGNUP_REQUEST_SUCCESS,
  SIGNUP_REQUEST_FAILED,
  SIGNIN_REQUESTED,
  SIGNIN_REQUEST_SUCCESS,
  SIGNIN_REQUEST_FAILED,
  SIGNUP_STATE_CLEAR,
  SIGNIN_STATE_CLEAR,
  USER_LOGOUT,
  VERIFY_USER_REQUESTED,
  VERIFY_USER_REQUEST_SUCCESS,
  VERIFY_USER_REQUEST_FAILED,
  CHANGE_PASSWORD_REQUESTED,
  CHANGE_PASSWORD_REQUEST_SUCCESS,
  CHANGE_PASSWORD_REQUEST_FAILED,
  GET_USERS_BY_VENDOR_REQUESTED,
} from '../types'

// Sign-up
export function signUpRequest(payload) {
  return {
    type: SIGNUP_REQUESTED,
    payload,
  }
}

export function signUpSuccess(payload) {
  return {
    type: SIGNUP_REQUEST_SUCCESS,
    payload,
  }
}

export function signUpFailed(error) {
  return {
    type: SIGNUP_REQUEST_FAILED,
    payload: error,
  }
}
export function signUpClearState(error) {
  return {
    type: SIGNUP_STATE_CLEAR,
  }
}

// Sign-in
export function signInRequest(email, password) {
  return {
    type: SIGNIN_REQUESTED,
    email,
    password,
  }
}

export function signInSuccess(payload) {
  return {
    type: SIGNIN_REQUEST_SUCCESS,
    payload,
  }
}

export function signInFailed(error) {
  return {
    type: SIGNIN_REQUEST_FAILED,
    payload: error,
  }
}

export function signInClearState() {
  return {
    type: SIGNIN_STATE_CLEAR,
  }
}

// Reset password - Verify code
export function verifyUserRequest(data) {
  return {
    type: VERIFY_USER_REQUESTED,
    payload: data,
  }
}

export function verifyUserSuccess(payload) {
  return {
    type: VERIFY_USER_REQUEST_SUCCESS,
    payload,
  }
}

export function verifyUserFailed(error) {
  return {
    type: VERIFY_USER_REQUEST_FAILED,
    payload: error,
  }
}

// Reset password - change password
export function changePasswordRequest(data) {
  return {
    type: CHANGE_PASSWORD_REQUESTED,
    payload: data,
  }
}

export function changePasswordSuccess(payload) {
  return {
    type: CHANGE_PASSWORD_REQUEST_SUCCESS,
    payload,
  }
}

export function changePasswordFailed(error) {
  return {
    type: CHANGE_PASSWORD_REQUEST_FAILED,
    payload: error,
  }
}


// Sign-out
export function userLogout() {
  return {
    type: USER_LOGOUT,
  }
}


export function getUsersByVendor(vendorId) {
  // console.log('userAction-vendorId',vendorId)
  return {
    type: GET_USERS_BY_VENDOR_REQUESTED,
    payload: vendorId,
  }
}
