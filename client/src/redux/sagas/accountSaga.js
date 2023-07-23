import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects'

import API_URL from '../../utils/api_url'

// get all accounts
function getAccountAllApi() {
  return axios
    .get('/api/accounts')
    .then((res) => {
      return res.data
    })
    .catch((error) => {
      // console.log('error in account saga: ' + error)
      return error
    })
}
// get all accounts - fetch
function* fetchAccountALL() {
  try {
    const accounts = yield call(getAccountAllApi)
    yield delay(100)
    yield put({ type: 'GET_ACCOUNT_SUCCESS', accounts: accounts })
  } catch (e) {
    yield put({ type: 'GET_ACCOUNT_FAILED', message: e.message })
  }
}

// get account by email
function getAccountByEmail(value) {
  return axios.get(`${API_URL}api/v1/accounts/auth/email=${value.payload}`)
                .then(res => {
                    return res.data
                  })
                .catch((error)=>{
                    // console.log("error in biz saga: "+ error)
                    return error
                })
}
// get account by email - fetch
function* fetchAccountByEmail(value) {
  try {
    const account = yield call(getAccountByEmail, value);
    yield delay(500)
    yield put({ type: 'GET_ACCOUNT_EMAIL_SUCCESS', account: account })
  } catch (e) {
    yield put({ type: 'GET_ACCOUNT_EMAIL_FAILED', message: e.message })
  }
}


// get account by userId
function getAccountByUserId(value) {
  return axios.get(`${API_URL}api/v1/accounts/${value.payload}`).then(res => {
    return res.data
  }).catch((error)=>{
    // console.log("error in biz saga: "+ error)
    return error
  })
}
// get account by userId - fetch
function* fetchAccountByUserId(value) {
  try {
    const account = yield call(getAccountByUserId, value);
    yield delay(500)
    yield put({ type: 'GET_ACCOUNT_ID_SUCCESS', account: account })
  } catch (e) {
    yield put({ type: 'GET_ACCOUNT_ID_FAILED', message: e.message })
  }
}


function* AccountSaga() {
  yield takeEvery('GET_ACCOUNT_REQUESTED', fetchAccountALL)
  yield takeEvery('GET_ACCOUNT_EMAIL_REQUESTED', fetchAccountByEmail)
  yield takeEvery('GET_ACCOUNT_ID_REQUESTED', fetchAccountByUserId)
}

export default AccountSaga
