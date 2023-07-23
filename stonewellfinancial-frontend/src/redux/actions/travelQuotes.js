import * as type from '../types';

export function getInsurance(insurances) {
  return {
    type: type.GET_INSURANCE_REQUESTED,
    payload: insurances,
  }
}


export function getInsurancebyEligibility(insurances) {
  return {
    type: type.GET_INSURANCE_ELIG_REQUESTED,
    payload: insurances,
  }
}
