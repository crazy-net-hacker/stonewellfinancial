import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects'

import API_URL from '../../utils/api_url'
// get all claim case
function getClaimCase() {
  return axios
    .get(`${API_URL}api/v1/claim_cases`)
    .then((res) => {
      // console.log(res.data)
      return res.data
    })
    .catch((error) => {
      // console.log("error in claim case saga: "+ error)
      return error
    })
}

function* fetchClaimCase() {
  try {
    const cases = yield call(getClaimCase)
    yield delay(500)
    yield put({ type: 'GET_CLAIM_CASE_SUCCESS', cases: cases })
  } catch (e) {
    yield put({ type: 'GET_CLAIM_CASE_FAILED', message: e.message })
  }
}


function* ClaimCaseSaga() {
  yield takeEvery('GET_CLAIM_CASE_REQUESTED', fetchClaimCase)
}

export default ClaimCaseSaga
