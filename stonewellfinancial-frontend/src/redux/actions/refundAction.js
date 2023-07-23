import * as type from '../types';

export function postRefundRequest(formData) {
  // console.log('postRefundRequest- action', formData)
  return {
    type: type.POST_REFUND_REQUEST_REQUESTED,
    payload: formData,
  }
}


export function getRefundRequest(criteriaData) {
  return {
    type: type.GET_REFUND_REQUEST_REQUESTED,
    payload: criteriaData,
  }
}

export function sendEmailToProvider(formData) {
  // console.log('sendEmailToProvider- action', formData)
  return {
    type: type.SEND_EMAIL_PROVIDER_REQUESTED,
    payload: formData,
  }
}

export function updateStatusRefund(updateData) {
  // console.log('updateStatusRefund- action', updateData)
  return {
    type: type.PUT_REFUND_STATUS_REQUESTED,
    payload: updateData,
  }
}