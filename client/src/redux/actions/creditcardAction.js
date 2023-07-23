import * as type from '../types';

export function getCreditCard(criteriaData) {
  // console.log(criteriaData);
  return {
    type: type.GET_CREDIT_CARD_REQUESTED,
    payload: criteriaData,
  }
}

export function postCreditCard(formData) {
  // console.log('postRefundRequest- action', formData)
  return {
    type: type.POST_CREDIT_CARD_REQUESTED,
    payload: formData,
  }
}

export function updateStatusCreditCard(updateData) {
  // console.log('updateStatusTravelApplication- action', updateData)
  return {
    type: type.PUT_CREDIT_CARD_STATUS_REQUESTED,
    payload: updateData,
  }
}