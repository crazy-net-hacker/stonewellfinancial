import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects'

import API_URL from '../../utils/api_url'

// get all country
function getCountry() {
  return axios
    .get(`${API_URL}api/v1/countries/country`)
    .then((res) => {
      // console.log(res.data)
      return res.data
    })
    .catch((error) => {
      // console.log('error in country saga: ' + error)
      return error
    })
}

function* fetchCountry() {
  try {
    const countries = yield call(getCountry)
    yield delay(500)
    yield put({ type: 'GET_COUNTRY_SUCCESS', countries: countries })
  } catch (e) {
    yield put({ type: 'GET_COUNTRY_FAILED', message: e.message })
  }
}

// get all province
function getProvince() {
  return axios
    .get(`${API_URL}api/v1/countries/province`)
    .then((res) => {
      // console.log(res.data)
      return res.data
    })
    .catch((error) => {
      // console.log("error in province saga: "+ error)
      return error
    })
}

function* fetchProvince() {
  try {
    const provinces = yield call(getProvince)
    yield delay(500)
    yield put({ type: 'GET_PROVINCE_SUCCESS', provinces: provinces })
  } catch (e) {
    yield put({ type: 'GET_PROVINCE_FAILED', message: e.message })
  }
}

function* CountrySaga() {
  yield takeEvery('GET_COUNTRY_REQUESTED', fetchCountry)
  yield takeEvery('GET_PROVINCE_REQUESTED', fetchProvince)
}

export default CountrySaga
