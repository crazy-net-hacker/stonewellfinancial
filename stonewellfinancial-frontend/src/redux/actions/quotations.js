import * as type from '../types';

export function getQuotations(quotations) {
  return {
    type: type.GET_QUOTATION_REQUESTED,
    payload: quotations,
  }
}

export function getQuotationsByList(quotationList) {
  return {
    type: type.GET_QUOTATION_LIST_REQUESTED,
    payload: quotationList,
  }
}

export function getQuotationsByEmail(quotations) {
  return {
    type: type.GET_QUOTATION_EMAIL_REQUESTED,
    payload: quotations,
  }
}