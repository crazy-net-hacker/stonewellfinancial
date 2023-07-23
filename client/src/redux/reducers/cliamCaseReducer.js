import * as type from '../types'

const initialState = {
  cases: [], //get all claim case
  loading: false,
  error: null,
}

export default function cliamCaseReducer(state = initialState, action) {
  switch (action.type) {
    // Get all claim case
    case type.GET_CLAIM_CASE_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case type.GET_CLAIM_CASE_SUCCESS:
      return {
        ...state,
        loading: false,
        cases: action.cases.data,
      }
    case type.GET_CLAIM_CASE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message,
      }
    default:
      return state
  }
}
