import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

// post refund
function postRefundRequest(value) {
  return axios.post(`${API_URL}api/v1/insured_refunds/add`, value.payload)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        console.log("error in Refund Request saga: "+ error)
        return error
      })
}

function* fetchPostRefundRequest(value) {
  try {;
    const result = yield call(postRefundRequest, value);
    yield delay(500)
    yield put({ type: 'POST_REFUND_REQUEST_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'POST_REFUND_REQUEST_FAILED', message: e.message });

  }
}

// get refund_reqeusted
function getRefundRequest(value) {
  const parmsValues = Object.values(value.payload);
  return axios.get(`${API_URL}api/v1/insured_refunds/fr=${parmsValues[0]}&to=${parmsValues[1]}&vendor_id=${parmsValues[2]}`)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Refund Request saga: "+ error)
        return error
      })
}

function* fetchGetRefundRequest(value) {
  try {
    const refunds = yield call(getRefundRequest, value);
    yield delay(500)
    yield put({ type: 'GET_REFUND_REQUEST_SUCCESS', refunds: refunds});
  } catch(e) {
    yield put({ type: 'GET_REFUND_REQUEST_FAILED', message: e.message });

  }
}


// post refund
function sendEmailProvider(value) {
  return axios.post(`${API_URL}api/v1/insured_refunds/send_email_provider`, value.payload)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Refund Request saga: "+ error)
        return error
      })
}

function* fetchSendEmailProvider(value) {
  try {;
    const result = yield call(sendEmailProvider, value);
    yield delay(500)
    yield put({ type: 'SEND_EMAIL_PROVIDER_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'SEND_EMAIL_PROVIDER_FAILED', message: e.message });

  }
}


// update (put) status refund
function updateStatusRefund(value) {
  // console.log('updateStatusRefund-values', value)
  return axios.put(`${API_URL}api/v1/insured_refunds/update/process/refund_id=${value.payload.refund_id}`, value.payload.data)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Refund saga: "+ error)
        return error
      })
}

function* fetchUpdateStatusRefund(value) {
  try {
    const result = yield call(updateStatusRefund, value);
    yield delay(500)
    yield put({ type: 'PUT_REFUND_STATUS_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_REFUND_STATUS_FAILED', message: e.message });

  }
}


function* insuredRefundSaga() {
  yield takeEvery('POST_REFUND_REQUEST_REQUESTED', fetchPostRefundRequest);
  yield takeEvery('GET_REFUND_REQUEST_REQUESTED', fetchGetRefundRequest);
  yield takeEvery('SEND_EMAIL_PROVIDER_REQUESTED', fetchSendEmailProvider);
  yield takeEvery('PUT_REFUND_STATUS_REQUESTED', fetchUpdateStatusRefund);
}

export default insuredRefundSaga