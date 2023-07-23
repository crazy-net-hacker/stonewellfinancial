import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects'

import API_URL from '../../utils/api_url'

// get all Vendor Accout
function getVendorAccount() {
  return axios
    .get(`${API_URL}api/v1/vendor_accounts`)
    .then((res) => {
      // console.log(res.data)
      return res.data
    })
    .catch((error) => {
      // console.log("error in vendor accounts saga: "+ error)
      return error
    })
}

function* fetchVendorAccount() {
  try {
    const vendors = yield call(getVendorAccount)
    yield delay(500)
    yield put({ type: 'GET_VENDOR_ACCOUNT_SUCCESS', vendors: vendors })
  } catch (e) {
    yield put({ type: 'GET_VENDOR_ACCOUNT_FAILED', message: e.message })
  }
}


// get vendor by access code
function getVendorAccountByAccessCode(value) {
  return axios.get(`${API_URL}api/v1/vendor_accounts/access/access_code=${value.payload}`)
  .then(res => {
    // console.log('saga- result',res.data)
    return res.data
  }).catch((error)=>{
    // console.log(match.params)
    console.log("error in vendor accounts saga: "+ error)
    return error
  })
}

function* fetchGetVendorAccountByAccessCode(value) {
  try {
    const vendors = yield call(getVendorAccountByAccessCode, value);
    yield delay(500)
    yield put({ type: 'GET_VENDOR_ACCOUNT_BY_ACCESS_CODE_SUCCESS', vendors: vendors});
  } catch(e) {
    yield put({ type: 'GET_VENDOR_ACCOUNT_BY_ACCESS_CODE_FAILED', message: e.message });

  }
}

// post Vendor Account
function postVendorAccount(value) {
  return axios.post(`${API_URL}api/v1/vendor_accounts/add`, value.payload)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in VendorAccount Us saga: "+ error)
        return error
      })
}

function* fetchPostVendorAccount(value) {
  try {
    const vendors = yield call(postVendorAccount, value);
    yield delay(500)
    yield put({ type: 'POST_VENDOR_ACCOUNT_SUCCESS', vendors: vendors });
  } catch(e) {
    yield put({ type: 'POST_VENDOR_ACCOUNT_FAILED', message: e.message });

  }
}

// update (put) Vendor
function updateVendorAccount(value) {
  return axios.put(`${API_URL}api/v1/vendor_accounts/update/update_target=${value.payload.update_target}&vendor_id=${value.payload.vendor_id}`, value.payload.data)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in VendorAccount saga: "+ error)
        return error
      })
}

function* fetchUpdateVendorAccount(value) {
  try {
    const result = yield call(updateVendorAccount, value);
    yield delay(500)
    yield put({ type: 'PUT_VENDOR_ACCOUNT_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_VENDOR_ACCOUNT_FAILED', message: e.message });

  }
}


// post Vendor user Account
function postVendorUser(value) {
  return axios.post(`${API_URL}api/v1/vendor_accounts/user/add`, value.payload)
      .then(res => {
        // console.log('saga- result',res)
        return res
      }).catch((error)=>{
        // console.log("error in VendorUser Us saga: "+ error)
        return error
      })
}

function* fetchPostVendorUser(value) {
  try {
    const user = yield call(postVendorUser, value);
    yield delay(500)
    yield put({ type: 'POST_VENDOR_USER_SUCCESS', user: user.data });
  } catch(e) {
    yield put({ type: 'POST_VENDOR_USER_FAILED', message: e.message });

  }
}


// update Vendor user Account
function updateVendorUser(value) {
  return axios.put(`${API_URL}api/v1/vendor_accounts/user/update/vendor_id=${value.payload.vendor_id}&user_id=${value.payload.user_id}`, value.payload.data)
      .then(res => {
        // console.log('saga- result',res)
        return res
      }).catch((error)=>{
        // console.log("error in VendorUser Us saga: "+ error)
        return error
      })
}

function* fetchUpdateVendorUser(value) {
  try {
    const result = yield call(updateVendorUser, value);
    yield delay(500)
    yield put({ type: 'PUT_VENDOR_USER_SUCCESS', result: result.data });
  } catch(e) {
    yield put({ type: 'PUT_VENDOR_USER_FAILED', message: e.message });

  }
}


function* vendorAccountSaga() {
  yield takeEvery('GET_VENDOR_ACCOUNT_REQUESTED', fetchVendorAccount)
  yield takeEvery('GET_VENDOR_ACCOUNT_BY_ACCESS_CODE_REQUESTED', fetchGetVendorAccountByAccessCode);
  yield takeEvery('POST_VENDOR_ACCOUNT_REQUESTED', fetchPostVendorAccount);
  yield takeEvery('PUT_VENDOR_ACCOUNT_REQUESTED', fetchUpdateVendorAccount);
  yield takeEvery('POST_VENDOR_USER_REQUESTED', fetchPostVendorUser);
  yield takeEvery('PUT_VENDOR_USER_REQUESTED', fetchUpdateVendorUser);
}



export default vendorAccountSaga
