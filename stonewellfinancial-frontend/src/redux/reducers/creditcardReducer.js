import * as type from '../types';

const initialState = {
  result: [], //all result
  creditcards: [], //get data
  loading: false,
  error: null,
  updatedCreditcard: [],
  UpdatedLoading: false,
  UpdatedError: null,
}

export default function creditcardReducer(state = initialState, action) {
  switch(action.type) {
      case type.GET_CREDIT_CARD_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.GET_CREDIT_CARD_SUCCESS: 
        return {
          ...state,
          loading: false,
          creditcards: action.creditcards.data
        }
      case type.GET_CREDIT_CARD_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }
      case type.POST_CREDIT_CARD_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.POST_CREDIT_CARD_SUCCESS: 
        return {
          ...state,
          loading: false,
          result: action.result
        }
      case type.POST_CREDIT_CARD_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }
      // Put (update status) credit card
      case type.PUT_CREDIT_CARD_STATUS_REQUESTED: 
        return {
          ...state,
          UpdatedLoading: true,
        }
      case type.PUT_CREDIT_CARD_STATUS_SUCCESS: 
        return {
          ...state,
          UpdatedLoading: false,
          updatedCreditcard: action.result
        }
      case type.PUT_CREDIT_CARD_STATUS_FAILED:
        return {
          ...state,
          UpdatedLoading: false,
          UpdatedError: action.message
        }      
      default:
        return state;
  }
}
