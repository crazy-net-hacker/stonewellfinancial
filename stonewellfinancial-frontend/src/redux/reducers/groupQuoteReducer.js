import * as type from '../types';

const initialState = {
  result: [], //all result
  quotes: [], //get data
  loading: false,
  error: null,
}

export default function groupQuoteReducer(state = initialState, action) {
  //Add Group Quote
  switch(action.type) {
        // Get Group Quote
        case type.GET_GROUP_QUOTE_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.GET_GROUP_QUOTE_SUCCESS: 
        return {
          ...state,
          loading: false,
          quotes: action.quotes.data,
        }
      case type.GET_GROUP_QUOTE_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        } 
        // Post Group Quote
        case type.POST_GROUP_QUOTE_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.POST_GROUP_QUOTE_SUCCESS: 
        return {
          ...state,
          loading: false,
          result: action.result
        }
      case type.POST_GROUP_QUOTE_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }     

    default:
      return state;
  }
}
