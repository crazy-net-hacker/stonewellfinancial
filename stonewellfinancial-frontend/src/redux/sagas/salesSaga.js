import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

// get vendor Statement by Vendor
function getVendorStatementsByVendor(value) {
  const parmsValues = Object.values(value.payload);
  // return axios.get(`${API_URL}api/v1/sales/report/vendor_id=${value.payload}`)
  return axios.get(`${API_URL}api/v1/sales/report/fr=${parmsValues[0]}&to=${parmsValues[1]}&vendor_id=${parmsValues[2]}`)
  .then(res => {
    // console.log('saga- result',res.data)
    return res.data
  }).catch((error)=>{
    // console.log(match.params)
    // console.log("error in Vendor Statement saga: "+ error)
    return error
  })
}

function* fetchGetVendorStatementsByVendor(value) {
  try {
    const statements = yield call(getVendorStatementsByVendor, value);
    yield delay(500)
    yield put({ type: 'GET_VENDORSTATEMENT_BY_VENDOR_SUCCESS', statements: statements});
  } catch(e) {
    yield put({ type: 'GET_VENDORSTATEMENT_BY_VENDOR_FAILED', message: e.message });

  }
}

function* salesSaga() {
  // yield takeEvery('GET_VENDORSTATEMENT_REQUESTED', fetchGetVendorStatements);
  yield takeEvery('GET_VENDORSTATEMENT_BY_VENDOR_REQUESTED', fetchGetVendorStatementsByVendor);
}

export default salesSaga