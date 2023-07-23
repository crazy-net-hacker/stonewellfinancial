import * as type from '../types';


export function getTravelApplications(criteriaData) {
  return {
    type: type.GET_APPLICAION_REQUESTED,
    payload: criteriaData,
  }
}

export function getTravelApplicantMedicalAnswer(criteriaData) {
  // console.log(criteriaData)
  return {
    type: type.GET_APPLICANT_MED_ANSWER_REQUESTED,
    payload: criteriaData,
  }
}

export function getTravelApplicationsByClient(userId) {
  return {
    type: type.GET_APPLICAION_BY_CLIENT_REQUESTED,
    payload: userId,
  }
}

export function getRenewableApplications() {
  return {
    type: type.GET_RENEWABLE_APPLICAION_REQUESTED,
    payload: '',
  }
}

export function postTravelApplication(formData) {
  // console.log('postTravelApplication- action', formData)
  return {
    type: type.POST_APPLICAION_REQUESTED,
    payload: formData,
  }
}

export function updatePaymentTravelApplication(formData) {
  return {
    type: type.PUT_APPLICAION_PAYMENT_REQUESTED,
    payload: formData,
  }
}

export function updateStatusTravelApplication(updateData) {
  // console.log('updateStatusTravelApplication- action', updateData)
  return {
    type: type.PUT_APPLICAION_STATUS_REQUESTED,
    payload: updateData,
  }
}

export function updateTravelApplication(updateData) {
  // console.log('updateTravelApplication- action', updateData)
  return {
    type: type.PUT_APPLICAION_REQUESTED,
    payload: updateData,
  }
}

// sell Tuogo Policies base on only Tugo's Travel Application  
export function sellTugoPolicy(formData) {
  // console.log('sellTugoPolicy- action', formData)
  return {
    type: type.PUT_SELL_TUGO_POLICY_REQUESTED,
    payload: formData,
  }
}

// sell Carewell
export function sellCarewell(formData) {
  // console.log('sellCarewell- action', formData)
  return {
    type: type.PUT_SELL_CAREWELL_REQUESTED,
    payload: formData,
  }
}

// send email renewable Application
// Application for renewal: 0 days, 14 days from the expiration date
export function senEmailRenewableApplications() {
  return {
    type: type.SEND_EMAIL_RENEWABLE_APPLICAION_REQUESTED,
    payload: '',
  }
}

//merge ZCRM Sales to ZApplications 
export function mergeZCRMSalesApplication(data) {
  // console.log('mergeZCRMSalesApplication- action', data)
  return {
    type: type.GET_MERGE_ZAPPLICAION_REQUESTED,
    payload: data,
  }
}

