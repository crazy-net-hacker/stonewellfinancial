import * as type from '../types'

const initialState = {
  insured: [], //get all insrued person
  loading: false,
  error: null,
}

export default function insuredPersonReducer(state = initialState, action) {
  switch (action.type) {
    // Get all country
    case type.GET_INSURED_BY_VENDOR_REQUESTED:
      // console.log('GET_INSURED_BY_VENDOR_REQUESTED ')
      return {
        ...state,
        loading: true,
      }
    case type.GET_INSURED_BY_VENDOR_SUCCESS:
      // console.log('GET_INSURED_BY_VENDOR_SUCCESS ')
      return {
        ...state,
        loading: false,
        insured: action.insured.data,
      }
    case type.GET_INSURED_BY_VENDOR_FAILED:
      // console.log('GET_INSURED_BY_VENDOR_FAILED ')
      return {
        ...state,
        loading: false,
        error: action.message,
      }

    default:
      return state
  }
}
