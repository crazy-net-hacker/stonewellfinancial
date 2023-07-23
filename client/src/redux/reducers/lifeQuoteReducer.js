import * as type from '../types';

const initialState = {
  result: [], //all result
  quotes: [], //get data
  loading: false,
  error: null,
}

export default function lifeQuoteReducer(state = initialState, action) {
  //Add Life Quote
  switch(action.type) {
        // Get Life Quote
        case type.GET_LIFE_QUOTE_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.GET_LIFE_QUOTE_SUCCESS: 
        return {
          ...state,
          loading: false,
          quotes: action.quotes.data,
        }
      case type.GET_LIFE_QUOTE_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        } 
        // Post Life Quote
        case type.POST_LIFE_QUOTE_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.POST_LIFE_QUOTE_SUCCESS: 
        return {
          ...state,
          loading: false,
          result: action.result
        }
      case type.POST_LIFE_QUOTE_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }   
      // Get life quote by client
      case type.GET_LIFE_QUOTE_BY_CLIENT_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.GET_LIFE_QUOTE_BY_CLIENT_SUCCESS: 
        return {
          ...state,
          loading: false,
          quotes: action.quotes.data,
        }
      case type.GET_LIFE_QUOTE_BY_CLIENT_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }    

    default:
      return state;
  }
}
