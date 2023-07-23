import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

function getAllApi() {
  return axios.get(`${API_URL}api/quotations`)
      .then(res => {
        return res.data
      }).catch((error)=>{
        // console.log("error in biz saga: "+ error)
        return error
      })
}

function* fetchQuotation() {
  try {
    const quotations = yield call(getAllApi);
    yield delay(500)
    yield put({ type: 'GET_QUOTATION_SUCCESS', quotations: quotations});
  } catch(e) {
    yield put({ type: 'GET_QUOTATION_FAILED', message: e.message });

  }
}


function getApiByList(value) {
   const parmsValues = Object.values(value.payload);
  return axios.get(`${API_URL}api/quotations/list/fr=${parmsValues[0]}&to=${parmsValues[1]}&id=${parmsValues[2]}`)
      .then(res => {
        return res.data
      }).catch((error)=>{
        // console.log("error in biz saga: "+ error)
        return error
      })
}

function* fetchQuotationByList(value) {
  try {
    const quotations = yield call(getApiByList,value);
    yield delay(500)
    yield put({ type: 'GET_QUOTATION_LIST_SUCCESS', quotations: quotations});
  } catch(e) {
    yield put({ type: 'GET_QUOTATION_LIST_FAILED', message: e.message });

  }
}


function getApiByEmail(value) {
 return axios.get(`${API_URL}api/quotations/list/lookup/${value.payload}`)
      .then(res => {
        return res.data
      }).catch((error)=>{
        // console.log("error in biz saga: "+ error)
        return error
      })
}

function* fetchQuotationByEmail(value) {
 try {
   const quotations = yield call(getApiByEmail,value);
   yield delay(500)
   yield put({ type: 'GET_QUOTATION_EMAIL_SUCCESS', quotations: quotations});
 } catch(e) {
   yield put({ type: 'GET_QUOTATION_EMAIL_FAILED', message: e.message });

 }
}

function* QuotationSaga() {
  yield takeEvery('GET_QUOTATION_REQUESTED', fetchQuotation);
  yield takeEvery('GET_QUOTATION_LIST_REQUESTED', fetchQuotationByList);
  yield takeEvery('GET_QUOTATION_EMAIL_REQUESTED', fetchQuotationByEmail);
}

export default QuotationSaga