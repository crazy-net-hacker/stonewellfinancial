import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

// get all insurace 
function getInsurance() {
  return axios.get(`${API_URL}api/v1/insurance_plans/insurance`)
      .then(res => {
        // console.log(res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel Insurance saga: "+ error)
        return error
      })
}

function* fetchInsurance() {
  try {
    const insurances = yield call(getInsurance);
    yield delay(500)
    yield put({ type: 'GET_INSURANCE_SUCCESS', insurances: insurances});
  } catch(e) {
    yield put({ type: 'GET_INSURANCE_FAILED', message: e.message });

  }
}


// get all insurace by eligibility
function getInsurancebyEligibility(value) {
  const parmsValues = Object.values(value.payload);
  return axios.get(`${API_URL}api/v1/insurance_plans/insurance/type=${parmsValues[0]}&length=${parmsValues[1]}&age=${parmsValues[2]}`)
      .then(res => {
        // console.log(res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel Insurance saga: "+ error)
        return error
      })
}

function* fetchInsurancebyEligibility(value) {
  try {
    const insurances = yield call(getInsurancebyEligibility, value);
    yield delay(500)
    yield put({ type: 'GET_INSURANCE_ELIG_SUCCESS', insurances: insurances});
  } catch(e) {
    yield put({ type: 'GET_INSURANCE_ELIG_FAILED', message: e.message });

  }
}

function* TravelQuoteSaga() {
  yield takeEvery('GET_INSURANCE_REQUESTED', fetchInsurance);
  yield takeEvery('GET_INSURANCE_ELIG_REQUESTED', fetchInsurancebyEligibility);
}

export default TravelQuoteSaga