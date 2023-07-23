import * as type from '../types'

const initialState = {
  insurances: [], // insurance by type
  insurancePlans: [], // insurance plans
  updatedResult: [], // Updated result
  UpdatedLoading: false,
  UpdatedError: null,
  documents: [],
  loading: false,
  error: null,
}

export default function insurancePlanReducer(state = initialState, action) {
  switch (action.type) {
    // Get Insurance Plan
    case type.GET_INSURANCE_PLAN_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case type.GET_INSURANCE_PLAN_SUCCESS:
      // console.log('GET_INSURANCE_PLAN_SUCCESS ', action.insurancePlans.data.rows)
      return {
        ...state,
        loading: false,
        insurancePlans: action.insurancePlans.data.rows,
      }
    case type.GET_INSURANCE_PLAN_FAILED:
      // console.log('GET_INSURANCE_PLAN_FAILED ', action)
      return {
        ...state,
        loading: false,
        error: action.message,
      }

    // Update (Put) Insurance Plan
    case type.PUT_INSURANCE_PLAN_REQUESTED:
      return {
        ...state,
        UpdatedLoading: true,
      }
    case type.PUT_INSURANCE_PLAN_SUCCESS:
      return {
        ...state,
        UpdatedLoading: false,
        updatedResult: action.result
      }
    case type.PUT_INSURANCE_PLAN_FAILED:
      return {
        ...state,
        UpdatedLoading: false,
        UpdatedError: action.message,
      }
      
    // Get Insurance by type
    case type.GET_INSURANCE_TYPE_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case type.GET_INSURANCE_TYPE_SUCCESS:
      // console.log('GET_INSURANCE_TYPE_SUCCESS ', action)
      return {
        ...state,
        loading: false,
        insurances: action.insurances.data.rows,
      }
    case type.GET_INSURANCE_TYPE_FAILED:
      // console.log('GET_INSURANCE_TYPE_FAILED ', action)
      return {
        ...state,
        loading: false,
        error: action.message,
      }
    // GET Insurance Plan Documents 
    case type.GET_PLAN_DOCUMENT_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case type.GET_PLAN_DOCUMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        documents: action.documents.data.rows,
      }
    case type.GET_PLAN_DOCUMENT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message,
      }
    default:
      return state
  }
}
