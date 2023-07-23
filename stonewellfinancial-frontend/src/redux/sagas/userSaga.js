import axios from 'axios'
import { takeLatest, put, call, takeEvery, delay } from 'redux-saga/effects'
// import { takeLatest, put, call } from 'redux-saga/effects'
import { API_SIGNUP_REQUEST, API_SIGNIN_REQUEST } from '../apiConstants'
import { SIGNUP_REQUESTED, SIGNIN_REQUESTED, VERIFY_USER_REQUESTED, CHANGE_PASSWORD_REQUESTED } from '../types'
import request from '../request'
import {
  signUpFailed,
  signUpSuccess,
  signInFailed,
  signInSuccess,
  verifyUserSuccess,
  verifyUserFailed,
  changePasswordSuccess,
  changePasswordFailed
} from '../actions/userAction'
import { UserRole, Username, UserId, Email, Token } from '../../views/layouts/constants'
import { SaveToLocalStore } from '../../views/layouts/utils'

import API_URL from '../../utils/api_url'

let userName = ''
let userId = ''
let email = ''
let role = ''
let token = ''

export function* signUp(data) {
  const requestURL = API_SIGNUP_REQUEST

  const headers = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data.payload),
  }

  try {
    // Call our request helper (see 'redux/request')
    const apiresponse = yield call(request, requestURL, headers)

    if (apiresponse.success) {
      yield put(signUpSuccess(apiresponse))
      yield put(signInSuccess(apiresponse))
    } else {
      yield put(signUpFailed(apiresponse))
    }
  } catch (error) {
    throw new Error(error)
  }
}

export function* signIn(data) {
  const requestURL = API_SIGNIN_REQUEST

  const user = {
    userName: data.name,
    userId : data.userId,
    email: data.email,
    password: data.password,
  }
  //console.log('SIGNIN USER', user)
  const headers = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  }

  try {
    // Call our request helper (see 'redux/request')
    const apiresponse = yield call(request, requestURL, headers)

    if (apiresponse.success) {

      if (apiresponse.data.name) {
        userName = apiresponse.data.name
        email = apiresponse.data.email
        userId = apiresponse.data.userId
      }
      if (apiresponse.data.email) {
        role = apiresponse.data.role
      }
      if (apiresponse.data.email) {
        token = apiresponse.refreshToken
      }

      SaveToLocalStore(Username, userName)
      SaveToLocalStore(UserId, userId)
      SaveToLocalStore(Email, email)
      SaveToLocalStore(UserRole, role)
      SaveToLocalStore(Token, token)

      yield put(signInSuccess(apiresponse))
    } else {
      yield put(signInFailed(apiresponse))
    }
  } catch (error) {
    throw new Error(error)
  }
}


// user verification
export function* verifyUser(data) {

  let requestURL = ''

  if (data.payload.verificationType === 'email'){
    requestURL = `${API_URL}api/v1/accounts/verify/type=${data.payload.verificationType}?email=${data.payload.email}&lastname=${data.payload.lastName}`
  } else if(data.payload.verificationType === 'code'){
    requestURL = `${API_URL}api/v1/accounts/verify/type=${data.payload.verificationType}?email=${data.payload.email}&lastname=${data.payload.lastName}&code=${data.payload.code}`
  }
  
  const headers = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }

  try {
    // Call our request helper (see 'redux/request')
    const apiresponse = yield call(request, requestURL, headers)
  
    if (apiresponse.status === 'success') {
      yield put(verifyUserSuccess(apiresponse))
    } else {
      yield put(verifyUserFailed(apiresponse))
    }
  } catch (error) {
    throw new Error(error)
  }
}

// change passwored
export function* changePassword(data) {
  
  let requestURL = `${API_URL}api/v1/accounts/change-password/email=${data.payload.email}`
  
  const headers = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data.payload)
  }

  try {
    // Call our request helper (see 'redux/request')
    const apiresponse = yield call(request, requestURL, headers)
  
    if (apiresponse.status === 'success') {
      yield put(changePasswordSuccess(apiresponse))
    } else {
      yield put(changePasswordFailed(apiresponse))
    }
  } catch (error) {
    throw new Error(error)
  }
}




// get user accounts
function getUserAccount(value) {
  const parmsValues = Object.values(value.payload);
  // console.log('parmsValues', parmsValues[0])
  return axios.get(`${API_URL}api/v1/accounts/users/vendor_id=${parmsValues[0]}`)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in user saga: "+ error)
        return error
      })
}

function* fetchGetUserAccount(value) {
  try {
    const users = yield call(getUserAccount, value);
    yield delay(500)
    yield put({ type: 'GET_USERS_BY_VENDOR_SUCCESS', users: users});
  } catch(e) {
    yield put({ type: 'GET_USERS_BY_VENDOR_FAILED', message: e.message });

  }
}


export default function* userSaga() {
  yield takeLatest(SIGNUP_REQUESTED, signUp)
  yield takeLatest(SIGNIN_REQUESTED, signIn)
  yield takeLatest(VERIFY_USER_REQUESTED, verifyUser)
  yield takeLatest(CHANGE_PASSWORD_REQUESTED, changePassword)
  yield takeEvery('GET_USERS_BY_VENDOR_REQUESTED', fetchGetUserAccount);
}

