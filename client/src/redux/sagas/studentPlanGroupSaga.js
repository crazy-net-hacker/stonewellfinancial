import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects'

import API_URL from '../../utils/api_url'

//import { API_GET_INSURANCE_BY_TYPE } from './../apiConstants'
// import {
//   getInsuranceByTypeFailed,
//   getInsuranceByTypeSuccess,
// } from './../actions/studentGroupPlan'
//import request from '../request'
// get all insurace
// function getInsurance() {
//   console.log('getInsurance() saga called')
//   return axios
//     .get(`${API_URL}api/v1/insurance_plans/insurance`)
//     .then((res) => {
//       //console.log(res.data)
//       return res.data
//     })
//     .catch((error) => {
//       // console.log("error in Travel Insurance saga: "+ error)
//       return error
//     })
// }

// function* fetchStudentGroupPlanInsurance() {
//   try {
//     //console.log('getStudentGroupPlanInsurance() saga called')
//     const insurances = yield call(getInsurance)
//     yield delay(500)
//     yield put({
//       type: 'GET_STUDENT_GROUP_INSURANCE_SUCCESS',
//       insurances: insurances,
//     })
//   } catch (e) {
//     yield put({
//       type: 'GET_STUDENT_GROUP_INSURANCE_FAILED',
//       message: e.message,
//     })
//   }
// }

function getInsuranceByType(type) {
  return axios
    .get(`${API_URL}api/v1/insurance_plans/insurance/type=${type}`)
    .then((res) => {
      // console.log('getInsuranceByType() saga called', res.data)
      return res.data
    })
    .catch((error) => {
      //   console.log('error in Travel Insurance saga: ' + error)
      return error
    })
}

export function* fetchInsurancebyByType(type) {
  // console.log('fetchInsurancebyByType ', data)
  try {
    //console.log('getStudentGroupPlanInsurance() saga called')
    const insurances = yield call(getInsuranceByType, type.payload)
    // console.log('fetchInsurancebyByType ', insurances)
    yield delay(500)
    yield put({
      type: 'GET_STUDENT_GROUP_INSURANCE_TYPE_SUCCESS',
      insurances: insurances,
    })
    // if (insurances) {
    //   yield put(getInsuranceByTypeSuccess(insurances))
    //   //yield put(getInsuranceByTypeFailed(insurances))
    // } else {
    //   yield put(getInsuranceByTypeFailed(insurances))
    // }
  } catch (e) {
    yield put({
      type: 'GET_STUDENT_GROUP_INSURANCE_TYPE_FAILED',
      message: e.message,
    })
  }

  // const requestURL = API_GET_INSURANCE_BY_TYPE + `/type=${data.payload}`

  // const headers = {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // }

  // try {
  //   // Call our request helper (see 'redux/request')
  //   const apiresponse = yield call(request, requestURL, headers)
  //   // console.log(apiresponse)
  //   if (apiresponse) {
  //     yield put(getInsuranceByTypeSuccess(apiresponse))
  //     //yield put(getInsuranceByTypeFailed(apiresponse))
  //   } else {
  //     yield put(getInsuranceByTypeFailed(apiresponse))
  //   }
  // } catch (error) {
  //   throw new Error(error)
  // }
}

function* studentPlanGroupSaga() {
  // yield takeEvery(
  //   'GET_STUDENT_GROUP_INSURANCE_REQUESTED',
  //   fetchStudentGroupPlanInsurance
  // )
  yield takeEvery(
    'GET_STUDENT_GROUP_INSURANCE_TYPE_REQUESTED',
    fetchInsurancebyByType
  )
}

export default studentPlanGroupSaga
