import * as type from '../types';

const initialState = {
  result: [], //all result
  statements: [], //get data
  
  loading: false,
  error: null,
}

export default function salesReducer(state = initialState, action) {

  switch(action.type) {
      // Get vendor statement
      case type.GET_VENDORSTATEMENT_BY_VENDOR_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.GET_VENDORSTATEMENT_BY_VENDOR_SUCCESS: 
        return {
          ...state,
          loading: false,
          statements: action.statements.data,
        }
      case type.GET_VENDORSTATEMENT_BY_VENDOR_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }  

        
    default:
      return state;
  }

}

