import * as type from '../types';

export function getLifeQuote(criteriaData) {
  return {
    type: type.GET_LIFE_QUOTE_REQUESTED,
    payload: criteriaData,
  }
}

export function getLifeQuoteByClient(userId) {
  return {
    type: type.GET_LIFE_QUOTE_BY_CLIENT_REQUESTED,
    payload: userId,
  }
}

export function postLifeQuote(formData) {
  // console.log('postLifeQuote- action', formData)
  return {
    type: type.POST_LIFE_QUOTE_REQUESTED,
    payload: formData,
  }
}


