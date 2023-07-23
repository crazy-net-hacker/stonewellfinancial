import * as type from '../types';

export function getHealthQuote(criteriaData) {
  return {
    type: type.GET_HEALTH_QUOTE_REQUESTED,
    payload: criteriaData,
  }
}

export function postHealthQuote(formData) {
  // console.log('postHealthQuote- action', formData)
  return {
    type: type.POST_HEALTH_QUOTE_REQUESTED,
    payload: formData,
  }
}


