import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects'

import API_URL from '../../utils/api_url'


// GET all insuredpersons who applied travel applicaion by vendor 
function getInsuredPersonByVendor(vendor) {
  return axios
    .get(`${API_URL}api/v1/insured_persons/search/vendor_id=${vendor}`)
    .then((res) => {
      return res.data
    })
    .catch((error) => {
      // console.log('error in country saga: ' + error)
      return error
    })
}

function* fetchInsuredPersonByVendory(value) {
  try {
    const insured = yield call(getInsuredPersonByVendor, value.payload)
    yield delay(500)
    yield put({ type: 'GET_INSURED_BY_VENDOR_SUCCESS', insured: insured })
  } catch (e) {
    yield put({ type: 'GET_INSURED_BY_VENDOR_FAILED', message: e.message })
  }
}

function* insuredPersonSaga() {
  yield takeEvery('GET_INSURED_BY_VENDOR_REQUESTED', fetchInsuredPersonByVendory)
}

export default insuredPersonSaga
