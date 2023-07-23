import * as type from '../types'

const initialState = {
  insurances: [], // insurance by type
  // travelquotes: [],
  loading: false,
  error: null,
}

export default function studentPlanGroupReducer(state = initialState, action) {
  switch (action.type) {
    // Get Insurance by type
    // case type.GET_STUDENT_GROUP_INSURANCE_REQUESTED:
    //   return {
    //     ...state,
    //     loading: true,
    //   }
    // case type.GET_STUDENT_GROUP_INSURANCE_SUCCESS:
    //   return {
    //     ...state,
    //     loading: false,
    //     insurances: action.insurances.data.rows,
    //   }
    // case type.GET_STUDENT_GROUP_INSURANCE_FAILED:
    //   return {
    //     ...state,
    //     loading: false,
    //     error: action.message,
    //   }

    // Get Insurance by type
    case type.GET_STUDENT_GROUP_INSURANCE_TYPE_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case type.GET_STUDENT_GROUP_INSURANCE_TYPE_SUCCESS:
      // console.log('GET_STUDENT_GROUP_INSURANCE_TYPE_SUCCESS ', action)
      return {
        ...state,
        loading: false,
        insurances: action.insurances.data.rows,
      }
    case type.GET_STUDENT_GROUP_INSURANCE_TYPE_FAILED:
      // console.log('GET_STUDENT_GROUP_INSURANCE_TYPE_FAILED ', action)
      return {
        ...state,
        loading: false,
        error: action.message,
      }
    default:
      return state
  }
}
