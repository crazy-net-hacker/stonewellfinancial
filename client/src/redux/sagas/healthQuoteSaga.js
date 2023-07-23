import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

// get health quote
function getHealthQuote() {
  return axios.get(`${API_URL}api/v1/health_quotes/`)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Health Quote saga: "+ error)
        return error
      })
}

function* fetchgetHealthQuote() {
  try {
    const quotes = yield call(getHealthQuote);
    yield delay(500)
    yield put({ type: 'GET_HEALTH_QUOTE_SUCCESS', quotes: quotes});
  } catch(e) {
    yield put({ type: 'GET_HEALTH_QUOTE_FAILED', message: e.message });

  }
}

// post health quote
function postHealthQuote(value) {
  return axios.post(`${API_URL}api/v1/health_quotes/add`, value.payload)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Health Quote saga: "+ error)
        return error
      })
}

function* fetchHealthQuote(value) {
  try {;
    const result = yield call(postHealthQuote, value);
    yield delay(500)
    yield put({ type: 'POST_HEALTH_QUOTE_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'POST_HEALTH_QUOTE_FAILED', message: e.message });

  }
}


function* healthQuoteSaga() {
  yield takeEvery('GET_HEALTH_QUOTE_REQUESTED', fetchgetHealthQuote);
  yield takeEvery('POST_HEALTH_QUOTE_REQUESTED', fetchHealthQuote);
}

export default healthQuoteSaga