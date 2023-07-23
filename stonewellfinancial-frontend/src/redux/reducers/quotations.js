import * as type from '../types';

const initialState = {
  quotations: [], //get all quotatiion
  quotationList: [], //get quotatiion List
  loading: false,
  error: null,
}

export default function quotationReducer(state = initialState, action) {
  switch(action.type) {
    // Get all quotation
    case type.GET_QUOTATION_REQUESTED: 
      return {
        ...state,
        loading: true,
      }
    case type.GET_QUOTATION_SUCCESS: 
      return {
        ...state,
        loading: false,
        quotations: action.quotations.quotations
      }
    case type.GET_QUOTATION_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message
      }
    // Get quotations by List
    case type.GET_QUOTATION_LIST_REQUESTED: 
      return {
        ...state,
        loading: true,
      }
    case type.GET_QUOTATION_LIST_SUCCESS: 
      return {
        ...state,
        loading: false,
        quotationList: action.quotations.quotations
      }
    case type.GET_QUOTATION_LIST_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message
      }
    // Get quotations by EMAIL
    case type.GET_QUOTATION_EMAIL_REQUESTED: 
      return {
        ...state,
        loading: true,
      }
    case type.GET_QUOTATION_EMAIL_SUCCESS: 
      return {
        ...state,
        loading: false,
        quotations: action.quotations.quotations
      }
    case type.GET_QUOTATION_EMAIL_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message
      }      
    default:
      return state;
  }
}
