import * as type from '../types';

const initialState = {
  result: [], //all result
  quotes: [], //get data
  loading: false,
  error: null,
}

export default function healthQuoteReducer(state = initialState, action) {
  //Add Travel Applications
  switch(action.type) {

      // Get Health Quote
      case type.GET_HEALTH_QUOTE_REQUESTED: 
      return {
        ...state,
        loading: true,
      }
    case type.GET_HEALTH_QUOTE_SUCCESS: 
      return {
        ...state,
        loading: false,
        quotes: action.quotes.data,
      }
    case type.GET_HEALTH_QUOTE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message
      }  

        // Post Health Quote
        case type.POST_HEALTH_QUOTE_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.POST_HEALTH_QUOTE_SUCCESS: 
        return {
          ...state,
          loading: false,
          result: action.result
        }
      case type.POST_HEALTH_QUOTE_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }     

    default:
      return state;
  }
}
