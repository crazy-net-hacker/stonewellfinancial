import * as type from '../types';

export function getGroupQuote(criteriaData) {
  return {
    type: type.GET_GROUP_QUOTE_REQUESTED,
    payload: criteriaData,
  }
}

export function postGroupQuote(formData) {
  // console.log('postGroupQuote- action', formData)
  return {
    type: type.POST_GROUP_QUOTE_REQUESTED,
    payload: formData,
  }
}


