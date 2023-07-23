import * as type from '../types'

// export function getInsurance(insurances) {
//   return {
//     type: type.GET_STUDENT_GROUP_INSURANCE_REQUESTED,
//     payload: insurances,
//   }
// }

export function getInsuranceByType(data) {
  return {
    type: type.GET_STUDENT_GROUP_INSURANCE_TYPE_REQUESTED,
    payload: data,
  }
}

export function getInsuranceByTypeSuccess(data) {
  return {
    type: type.GET_STUDENT_GROUP_INSURANCE_TYPE_SUCCESS,
    payload: data,
  }
}

export function getInsuranceByTypeFailed(data) {
  return {
    type: type.GET_STUDENT_GROUP_INSURANCE_TYPE_FAILED,
    payload: data,
  }
}
