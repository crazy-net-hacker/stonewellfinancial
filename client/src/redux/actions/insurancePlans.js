import * as type from '../types'

// get all insurances plans
export function getInsurancePlan() {
  return {
    type: type.GET_INSURANCE_PLAN_REQUESTED,
  }
}

// update (put) insurances plans
export function updateInsurancePlan(updateData) {
  return {
    type: type.PUT_INSURANCE_PLAN_REQUESTED,
    payload: updateData,
  }
}

// get insurances by type
export function getInsuranceByType(insurances) {
  return {
    type: type.GET_INSURANCE_TYPE_REQUESTED,
    payload: insurances,
  }
}

export function getInsuranceByTypeSuccess(data) {
  return {
    type: type.GET_INSURANCE_TYPE_SUCCESS,
    payload: data,
  }
}

export function getInsuranceByTypeFailed(data) {
  return {
    type: type.GET_INSURANCE_TYPE_FAILED,
    payload: data,
  }
}

// GET Insurance Plan Documents 
export function getPlanDocument(documents) {
  return {
    type: type.GET_PLAN_DOCUMENT_REQUESTED,
    payload: documents,
  }
}