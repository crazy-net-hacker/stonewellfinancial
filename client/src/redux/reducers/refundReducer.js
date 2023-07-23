import * as type from '../types';

const initialState = {
  result: [], //all result
  refunds: [], //get data
  loading: false,
  error: null,
  sendEmailResult: [],
  sendEmailLoading: false,
  sendEmailError: null,  
  updatedRefund: [],
  UpdatedLoading: false,
  UpdatedError: null,
}

export default function refundReducer(state = initialState, action) {
  switch(action.type) {
        case type.POST_REFUND_REQUEST_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.POST_REFUND_REQUEST_SUCCESS: 
        return {
          ...state,
          loading: false,
          result: action.result
        }
      case type.POST_REFUND_REQUEST_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }     
      
      case type.GET_REFUND_REQUEST_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.GET_REFUND_REQUEST_SUCCESS: 
        return {
          ...state,
          loading: false,
          refunds: action.refunds.data
        }
      case type.GET_REFUND_REQUEST_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }  

      case type.SEND_EMAIL_PROVIDER_REQUESTED: 
        return {
          ...state,
          sendEmailLoading: true,
        }
      case type.SEND_EMAIL_PROVIDER_SUCCESS: 
        return {
          ...state,
          sendEmailLoading: false,
          sendEmailResult: action.result
        }
      case type.SEND_EMAIL_PROVIDER_FAILED:
        return {
          ...state,
          sendEmailLoading: false,
          sendEmailError: action.message
        } 

      // Put (update status) refund
      case type.PUT_REFUND_STATUS_REQUESTED: 
          return {
            ...state,
            UpdatedLoading: true,
          }
        case type.PUT_REFUND_STATUS_SUCCESS: 
          return {
            ...state,
            UpdatedLoading: false,
            updatedRefund: action.result
          }
        case type.PUT_REFUND_STATUS_FAILED:
          return {
            ...state,
            UpdatedLoading: false,
            UpdatedError: action.message
          }   

    default:
      return state;
  }
}
