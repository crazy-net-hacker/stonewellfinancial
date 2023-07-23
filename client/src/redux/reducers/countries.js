import * as type from '../types'

const initialState = {
  countries: [], //get all country
  provinces: [], //get all province
  loading: false,
  error: null,
}

export default function countryReducer(state = initialState, action) {
  switch (action.type) {
    // Get all country
    case type.GET_COUNTRY_REQUESTED:
      // console.log('GET_COUNTRY_REQUESTED ')
      return {
        ...state,
        loading: true,
      }
    case type.GET_COUNTRY_SUCCESS:
      // console.log('GET_COUNTRY_SUCCESS ')
      return {
        ...state,
        loading: false,
        countries: action.countries.data.rows,
      }
    case type.GET_COUNTRY_FAILED:
      // console.log('GET_COUNTRY_FAILED ')
      return {
        ...state,
        loading: false,
        error: action.message,
      }

    case type.GET_PROVINCE_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case type.GET_PROVINCE_SUCCESS:
      return {
        ...state,
        loading: false,
        provinces: action.provinces.data.rows,
      }
    case type.GET_PROVINCE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message,
      }

    default:
      return state
  }
}
