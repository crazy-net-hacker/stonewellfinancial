import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

// get group quote
function getGroupQuote() {
  return axios.get(`${API_URL}api/v1/group_quotes/`)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Life Quote saga: "+ error)
        return error
      })
}

function* fetchgetGroupQuote() {
  try {
    const quotes = yield call(getGroupQuote);
    yield delay(500)
    yield put({ type: 'GET_GROUP_QUOTE_SUCCESS', quotes: quotes});
  } catch(e) {
    yield put({ type: 'GET_GROUP_QUOTE_FAILED', message: e.message });

  }
}

// post group quote
function postGroupQuote(value) {
  return axios.post(`${API_URL}api/v1/group_quotes/add`, value.payload)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Group Insurance saga: "+ error)
        return error
      })
}

function* fetchGroupQuote(value) {
  try {;
    const result = yield call(postGroupQuote, value);
    yield delay(500)
    yield put({ type: 'POST_GROUP_QUOTE_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'POST_GROUP_QUOTE_FAILED', message: e.message });

  }
}


function* GroupQuoteSaga() {
  yield takeEvery('GET_GROUP_QUOTE_REQUESTED', fetchgetGroupQuote);
  yield takeEvery('POST_GROUP_QUOTE_REQUESTED', fetchGroupQuote);
}

export default GroupQuoteSaga