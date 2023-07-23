import * as type from '../types';

const initialState = {
  result: [], //all result
  loading: false,
  error: null
}

export default function emailReducer(state = initialState, action) {
  switch(action.type) {
    // send policy email to client (insured)
    case type.SEND_EMAIL_CLIENT_REQUESTED: 
      return {
        ...state,
        loading: true,
      }
    case type.SEND_EMAIL_CLIENT_SUCCESS: 
      return {
        ...state,
        loading: false,
        result: action.result
      }
    case type.SEND_EMAIL_CLIENT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message
      }     
        
    default:
      return state;
  }
}

