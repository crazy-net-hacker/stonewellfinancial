import * as type from '../types';

const initialState = {
  insurances: [], //all insurace by eligibility
  travelquotes:[],
  loading: false,
  error: null,
}

export default function travelQuoteReducer(state = initialState, action) {
  switch(action.type) {
        // Get all insurace
        case type.GET_INSURANCE_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.GET_INSURANCE_SUCCESS: 
        return {
          ...state,
          loading: false,
          insurances: action.insurances.data.rows
        }
      case type.GET_INSURANCE_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }      
    // Get all insurace by eligibility
    case type.GET_INSURANCE_ELIG_REQUESTED: 
      return {
        ...state,
        loading: true,
      }
    case type.GET_INSURANCE_ELIG_SUCCESS: 
      return {
        ...state,
        loading: false,
        insurances: action.insurances.data.rows
      }
    case type.GET_INSURANCE_ELIG_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message
      }    
    default:
      return state;
  }
}
