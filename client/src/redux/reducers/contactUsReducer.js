import * as type from '../types';

const initialState = {
  result: [], //all result
  loading: false,
  error: null,
}

export default function contactUsReducer(state = initialState, action) {
  //Add Contact Us
  switch(action.type) {
        // Post Contact us
        case type.POST_CONTACT_US_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.POST_CONTACT_US_SUCCESS: 
      return {
          ...state,
          loading: false,
          result: action.result
        }
      case type.POST_CONTACT_US_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }             
    default:
      return state;
  }
}

