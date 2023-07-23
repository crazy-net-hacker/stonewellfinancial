import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

// get credit card info
function getCreditCard(value) {
  const parmsValues = Object.values(value.payload);
  // console.log(parmsValues)
  return axios.get(`${API_URL}api/v1/credit_card/fr=${parmsValues[0]}&to=${parmsValues[1]}&vendor_id=${parmsValues[2]}`)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Credit Card saga: "+ error)
        return error
      })
}

function* fetchGetCreditCard(value) {
  try {
    const creditcards = yield call(getCreditCard, value);
    yield delay(500)
    yield put({ type: 'GET_CREDIT_CARD_SUCCESS', creditcards: creditcards});
  } catch(e) {
    yield put({ type: 'GET_CREDIT_CARD_FAILED', message: e.message });

  }
}
// post credit card info
function postCreditCard(value) {
  return axios.post(`${API_URL}api/v1/credit_card/add`, value.payload)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Credit Card saga: "+ error)
        return error
      })
}

function* fetchPostCreditCard(value) {
  try {;
    const result = yield call(postCreditCard, value);
    yield delay(500)
    yield put({ type: 'POST_CREDIT_CARD_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'POST_CREDIT_CARD_FAILED', message: e.message });

  }
}

// update (put) status application
function updateStatusCreditCard(value) {
  return axios.put(`${API_URL}api/v1/credit_card/update/process/creditcard_id=${value.payload.creditcard_id}`, value.payload.data)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Credit Card saga: "+ error)
        return error
      })
}


function* fetchUpdateStatusCreditCard(value) {
  try {
    const result = yield call(updateStatusCreditCard, value);
    yield delay(500)
    yield put({ type: 'PUT_CREDIT_CARD_STATUS_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_CREDIT_CARD_STATUS_FAILED', message: e.message });

  }
}

function* creditcardSaga() {
  yield takeEvery('POST_CREDIT_CARD_REQUESTED', fetchPostCreditCard);
  yield takeEvery('GET_CREDIT_CARD_REQUESTED', fetchGetCreditCard);
  yield takeEvery('PUT_CREDIT_CARD_STATUS_REQUESTED', fetchUpdateStatusCreditCard);
  // yield takeEvery('SEND_EMAIL_PROVIDER_REQUESTED', fetchSendEmailProvider);
}

export default creditcardSaga