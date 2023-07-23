import * as type from '../types'

const initialState = {
  clinics: [], //get all clinic
  loading: false,
  error: null,
}

export default function clinicReducer(state = initialState, action) {
  switch (action.type) {
    // Get all clinic
    case type.GET_CLINIC_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case type.GET_CLINIC_SUCCESS:
      return {
        ...state,
        loading: false,
        clinics: action.clinics.data.rows,
      }
    case type.GET_CLINIC_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message,
      }
    case type.GET_CLINIC_DISTANCE_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case type.GET_CLINIC_DISTANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        clinics: action.clinics.data.rows,
      }
    case type.GET_CLINIC_DISTANCE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message,
      }  
    default:
      return state
  }
}
