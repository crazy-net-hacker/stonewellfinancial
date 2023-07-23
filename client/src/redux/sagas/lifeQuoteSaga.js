import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

// get life quote
function getLifeQuote() {
  return axios.get(`${API_URL}api/v1/life_quotes/`)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Life Quote saga: "+ error)
        return error
      })
}

function* fetchgetLifeQuote() {
  try {
    const quotes = yield call(getLifeQuote);
    yield delay(500)
    yield put({ type: 'GET_LIFE_QUOTE_SUCCESS', quotes: quotes});
  } catch(e) {
    yield put({ type: 'GET_LIFE_QUOTE_FAILED', message: e.message });

  }
}

// get life quote by client
function getLifeQuotesByClient(value) {
  return axios.get(`${API_URL}api/v1/life_quotes/list/user_id=${value.payload}`)
  .then(res => {
    console.log('saga- result',res.data)
    return res.data
  }).catch((error)=>{
    // console.log(match.params)
    console.log("error in Life Quote saga: "+ error)
    return error
  })
}

function* fetchGetLifeQuotesByClient(value) {
  try {
    const quotes = yield call(getLifeQuotesByClient, value);
    yield delay(500)
    yield put({ type: 'GET_LIFE_QUOTE_BY_CLIENT_SUCCESS', quotes: quotes});
  } catch(e) {
    yield put({ type: 'GET_LIFE_QUOTE_BY_CLIENT_FAILED', message: e.message });

  }
}

// post life quote
function postLifeQuote(value) {
  return axios.post(`${API_URL}api/v1/life_quotes/add`, value.payload)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Life Quote saga: "+ error)
        return error
      })
}

function* fetchLifeQuote(value) {
  try {;
    const result = yield call(postLifeQuote, value);
    yield delay(500)
    yield put({ type: 'POST_LIFE_QUOTE_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'POST_LIFE_QUOTE_FAILED', message: e.message });

  }
}


function* lifeQuoteSaga() {
  yield takeEvery('POST_LIFE_QUOTE_REQUESTED', fetchLifeQuote);
  yield takeEvery('GET_LIFE_QUOTE_REQUESTED', fetchgetLifeQuote);
  yield takeEvery('GET_LIFE_QUOTE_BY_CLIENT_REQUESTED', fetchGetLifeQuotesByClient);
}

export default lifeQuoteSaga