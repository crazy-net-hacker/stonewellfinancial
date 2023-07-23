import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects'

import API_URL from '../../utils/api_url'

// GET plan 
function getInsurancePlan() {
  return axios
    .get(`${API_URL}api/v1/insurance_plans/plan`)
    .then((res) => {
      return res.data
    })
    .catch((error) => {
      return error
    })
}

// Fetch Plan 
export function* fetchInsurancePlan() {
  try {
    const plans = yield call(getInsurancePlan)
    yield delay(500)
    yield put({ type: 'GET_INSURANCE_PLAN_SUCCESS', insurancePlans: plans,
    })
  } catch (e) {
    yield put({
      type: 'GET_INSURANCE_PLAN_FAILED',
      message: e.message,
    })
  }
}


// update (put) plan
function updateInsurancePlan(value) {
  return axios
    .put(`${API_URL}api/v1/insurance_plans/update/plan`, value.payload.data)
    .then((res) => {
      return res.data
    })
    .catch((error) => {
      return error
    })
}

// Fetch update (put) plan
export function* fetchUpdateInsurancePlan(value) {
  try {
    const result = yield call(updateInsurancePlan, value)
    yield delay(500)
    yield put({ type: 'PUT_INSURANCE_PLAN_SUCCESS', result: result,
    })
  } catch (e) {
    yield put({
      type: 'PUT_INSURANCE_PLAN_FAILED',
      message: e.message,
    })
  }
}


// GET Insurance By Type 
function getInsuranceByType(type) {
  return axios
    .get(`${API_URL}api/v1/insurance_plans/insurance/type=${type}`)
    .then((res) => {
      return res.data
    })
    .catch((error) => {
      return error
    })
}

// Fetch Insurance By Type 
export function* fetchInsuranceByType(type) {
  try {
    const insurances = yield call(getInsuranceByType, type.payload)
    yield delay(500)
    yield put({ type: 'GET_INSURANCE_TYPE_SUCCESS', insurances: insurances,
    })
  } catch (e) {
    yield put({
      type: 'GET_INSURANCE_TYPE_FAILED',
      message: e.message,
    })
  }
}


// GET Insurance Plan Documents 
function getPlanDocument() {
  return axios
    .get(`${API_URL}api/v1/insurance_plans/documents`)
    .then((res) => {
      return res.data
    })
    .catch((error) => {
      return error
    })
}

// Fetch Insurance Plan Documents 
export function* fetchPlanDocument() {
  try {
    const documents = yield call(getPlanDocument)
    yield delay(500)
    yield put({ type: 'GET_PLAN_DOCUMENT_SUCCESS', documents: documents,
    })
  } catch (e) {
    yield put({
      type: 'GET_PLAN_DOCUMENT_FAILED',
      message: e.message,
    })
  }
}

// Saga
function* insurancePlanSaga() {
    yield takeEvery('GET_INSURANCE_PLAN_REQUESTED', fetchInsurancePlan);
    yield takeEvery('PUT_INSURANCE_PLAN_REQUESTED', fetchUpdateInsurancePlan);
    yield takeEvery('GET_INSURANCE_TYPE_REQUESTED', fetchInsuranceByType);
    yield takeEvery('GET_PLAN_DOCUMENT_REQUESTED', fetchPlanDocument);
  }
  
export default insurancePlanSaga
