import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects'

import API_URL from '../../utils/api_url'
// get all Clinic
function getClinic() {
  return axios
    .get(`${API_URL}api/v1/clinics`)
    .then((res) => {
      // console.log(res.data)
      return res.data
    })
    .catch((error) => {
      // console.log("error in clinic saga: "+ error)
      return error
    })
}

function* fetchClinic() {
  try {
    const clinics = yield call(getClinic)
    yield delay(500)
    yield put({ type: 'GET_CLINIC_SUCCESS', clinics: clinics })
  } catch (e) {
    yield put({ type: 'GET_CLINIC_FAILED', message: e.message })
  }
}

// get distance to clinics by postal code
function getClinicDistance(value) {
  const parmsValues = Object.values(value.payload);
  return axios
    .get(`${API_URL}api/v1/clinics/distance/postalCode=${parmsValues[0]}`)
    .then((res) => {
      // console.log(res.data)
      return res.data
    })
    .catch((error) => {
      // console.log("error in clinic saga: "+ error)
      return error
    })
}

function* fetchDistanceToClinic(value) {
  try {
    const clinics = yield call(getClinicDistance, value)
    yield delay(500)
    // yield put({ type: 'GET_CLINIC_SUCCESS', clinics: clinics })
    yield put({ type: 'GET_CLINIC_DISTANCE_SUCCESS', clinics: clinics })
  } catch (e) {
    yield put({ type: 'GET_CLINIC_DISTANCE_FAILED', message: e.message })
  }
}

function* ClinicSaga() {
  yield takeEvery('GET_CLINIC_REQUESTED', fetchClinic)
  yield takeEvery('GET_CLINIC_DISTANCE_REQUESTED', fetchDistanceToClinic)
}

export default ClinicSaga
