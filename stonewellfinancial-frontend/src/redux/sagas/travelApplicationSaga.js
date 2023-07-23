import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

function getTravelApplication(value) {
  const parmsValues = Object.values(value.payload);
  // console.log('parmsValues', parmsValues)
  return axios.get(`${API_URL}api/v1/travel_applications/fr=${parmsValues[0]}&to=${parmsValues[1]}&vendor_id=${parmsValues[2]}`)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel application saga: "+ error)
        return error
      })
}

function* fetchGetTravelApplication(value) {
  try {
    const applications = yield call(getTravelApplication, value);
    yield delay(500)
    yield put({ type: 'GET_APPLICAION_SUCCESS', applications: applications});
  } catch(e) {
    yield put({ type: 'GET_APPLICAION_FAILED', message: e.message });

  }
}


// get applicant's medical questionnaire
function getTravelApplicantMedAnswer(value) {
  const parmsValues = Object.values(value.payload);
  return axios.get(`${API_URL}api/v1/travel_applications/med-questionnaire/application_id=${parmsValues[0]}&insured_id=${parmsValues[1]}`)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel application saga: "+ error)
        return error
      })
}

function* fetchGetTravelApplicantMedAnswer(value) {
  try {
    const answer = yield call(getTravelApplicantMedAnswer, value);
    yield delay(500)
    yield put({ type: 'GET_APPLICANT_MED_ANSWER_SUCCESS', answer: answer});
  } catch(e) {
    yield put({ type: 'GET_APPLICANT_MED_ANSWER_FAILED', message: e.message });

  }
}

// get travel application by client
function getTravelApplicationsByClient(value) {
  return axios.get(`${API_URL}api/v1/travel_applications/list/user_id=${value.payload}`)
  .then(res => {
    // console.log('saga- result',res.data)
    return res.data
  }).catch((error)=>{
    // console.log(match.params)
    console.log("error in Travel application saga: "+ error)
    return error
  })
}

function* fetchGetTravelApplicationsByClient(value) {
  try {
    const applications = yield call(getTravelApplicationsByClient, value);
    yield delay(500)
    yield put({ type: 'GET_APPLICAION_BY_CLIENT_SUCCESS', applications: applications});
  } catch(e) {
    yield put({ type: 'GET_APPLICAION_BY_CLIENT_FAILED', message: e.message });

  }
}


//  Get Renewable Application
function getRenewableApplication(value) {
  return axios.get(`${API_URL}api/v1/travel_applications/renewable`)
  .then(res => {
    // console.log('saga- result',res.data)
    return res.data
  }).catch((error)=>{
    // console.log(match.params)
    console.log("error in Travel application saga: "+ error)
    return error
  })
}

function* fetchGetRenewableApplication(value) {
  try {
    const applications = yield call(getRenewableApplication, value);
    yield delay(500)
    yield put({ type: 'GET_RENEWABLE_APPLICAION_SUCCESS', applications: applications});
  } catch(e) {
    yield put({ type: 'GET_RENEWABLE_APPLICAION_FAILED', message: e.message });

  }
}


// post application
function postTravelApplication(value) {
  return axios.post(`${API_URL}api/v1/travel_applications/add`, value.payload)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel Insurance saga: "+ error)
        return error
      })
}

function* fetchPostTravelApplication(value) {
  try {
    const result = yield call(postTravelApplication, value);
    yield delay(500)
    yield put({ type: 'POST_APPLICAION_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'POST_APPLICAION_FAILED', message: e.message });

  }
}


// update (put) payment application
function updatePaymentTravelApplication(value) {
  return axios.put(`${API_URL}api/v1/travel_applications/update/direct-payment/confirmation_no=${value.payload.confirmationNo}`, value.payload)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel Insurance saga: "+ error)
        return error
      })
}

function* fetchUpdatePaymentTravelApplication(value) {
  try {
    const result = yield call(updatePaymentTravelApplication, value);
    yield delay(500)
    yield put({ type: 'PUT_APPLICAION_PAYMENT_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_APPLICAION_PAYMENT_FAILED', message: e.message });

  }
}
// update (put) status application
function updateStatusTravelApplication(value) {
  // return axios.put(`${API_URL}api/v1/travel_applications/update/application_id=${value.payload.application_id}&token=${value.payload.token}`, value.payload.data)
  return axios.put(`${API_URL}api/v1/travel_applications/update/process/application_id=${value.payload.application_id}`, value.payload.data)
  // return axios.put(`${API_URL}api/v1/travel_quotes/update/process/application_id=${value.payload.application_id}`, value.payload.data)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel Insurance saga: "+ error)
        return error
      })
}

function* fetchUpdateStatusTravelApplication(value) {
  try {
    const result = yield call(updateStatusTravelApplication, value);
    yield delay(500)
    yield put({ type: 'PUT_APPLICAION_STATUS_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_APPLICAION_STATUS_FAILED', message: e.message });

  }
}

// update (put) application
function updateTravelApplication(value) {
  return axios.put(`${API_URL}api/v1/travel_applications/update/update_target=${value.payload.update_target}&application_id=${value.payload.application_id}`, value.payload.data)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel Insurance saga: "+ error)
        return error
      })
}

function* fetchUpdateTravelApplication(value) {
  try {
    const result = yield call(updateTravelApplication, value);
    yield delay(500)
    yield put({ type: 'PUT_APPLICAION_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_APPLICAION_FAILED', message: e.message });

  }
}


// merge ZCRM Sales to ZApplications
function mergeZCRMSalesApplication() {
  return axios.get(`${API_URL}api/v1/zcrm_applications/merge`)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel Insurance saga: "+ error)
        return error
      })
}

function* fetchMergeZCRMSalesApplication() {
  try {
    const result = yield call(mergeZCRMSalesApplication);
    yield delay(500)
    yield put({ type: 'GET_MERGE_ZAPPLICAION_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'GET_MERGE_ZAPPLICAION_FAILED', message: e.message });

  }
}

// send email after Gettting Renewable Application
// Application for renewal: 0 days, 14 days from the expiration date
function sendEmailRenewableApplication(value) {
  return axios.get(`${API_URL}api/v1/travel_applications/send_email/renewable`)
  .then(res => {
    // console.log('saga- result',res.data)
    return res.data
  }).catch((error)=>{
    // console.log(match.params)
    console.log("error in Travel application saga: "+ error)
    return error
  })
}

function* fetchSendEmailRenewableApplication(value) {
  try {
    const result = yield call(sendEmailRenewableApplication, value);
    yield delay(500)
    yield put({ type: 'SEND_EMAIL_RENEWABLE_APPLICAION_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'SEND_EMAIL_RENEWABLE_APPLICAION_FAILED', message: e.message });

  }
}


//  Put (sell Tugo Policies & update policy number) Travel Application 
function sellTugoPolicy(value) {
  return axios.put(`${API_URL}api/v1/travel_applications/sell/policies/application_id=${value.payload.application_id}`, value.payload.data)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Travel Insurance saga: "+ error)
        return error
      })
}

function* fetchSellTugoPolicy(value) {
  try {
    const result = yield call(sellTugoPolicy, value);
    yield delay(500)
    yield put({ type: 'PUT_SELL_TUGO_POLICY_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_SELL_TUGO_POLICY_FAILED', message: e.message });

  }
}

//  Put (sell Carewell) Travel Application 
function sellCarewell(value) {
  return axios.put(`${API_URL}api/v1/travel_applications/sell/carewell/application_id=${value.payload.application_id}`, value.payload.data)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        console.log("error in Travel Insurance saga: "+ error)
        return error
      })
}

function* fetchSellCarewell(value) {
  try {
    const result = yield call(sellCarewell, value);
    // console.log(result)
    yield delay(500)
    yield put({ type: 'PUT_SELL_CAREWELL_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'PUT_SELL_CAREWELL_FAILED', message: e.message });

  }
}

function* TravelApplicationSaga() {
  yield takeEvery('GET_APPLICAION_REQUESTED', fetchGetTravelApplication);
  yield takeEvery('GET_APPLICANT_MED_ANSWER_REQUESTED', fetchGetTravelApplicantMedAnswer);
  yield takeEvery('GET_APPLICAION_BY_CLIENT_REQUESTED', fetchGetTravelApplicationsByClient);
  yield takeEvery('GET_RENEWABLE_APPLICAION_REQUESTED', fetchGetRenewableApplication);
  yield takeEvery('POST_APPLICAION_REQUESTED', fetchPostTravelApplication);
  yield takeEvery('PUT_APPLICAION_PAYMENT_REQUESTED', fetchUpdatePaymentTravelApplication);
  yield takeEvery('PUT_APPLICAION_STATUS_REQUESTED', fetchUpdateStatusTravelApplication);
  yield takeEvery('PUT_APPLICAION_REQUESTED', fetchUpdateTravelApplication);
  yield takeEvery('GET_MERGE_ZAPPLICAION_REQUESTED', fetchMergeZCRMSalesApplication);
  yield takeEvery('SEND_EMAIL_RENEWABLE_APPLICAION_REQUESTED', fetchSendEmailRenewableApplication);
  yield takeEvery('PUT_SELL_TUGO_POLICY_REQUESTED', fetchSellTugoPolicy);
  yield takeEvery('PUT_SELL_CAREWELL_REQUESTED', fetchSellCarewell);
}

export default TravelApplicationSaga