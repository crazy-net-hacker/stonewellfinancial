import * as type from '../types'

const initialState = {
  vendor: [], //vendor_account
  vendors: [], //vendor_accounts
  result: [], //vendor_accounts
  loading: false,
  error: null,
  user: [], // vendor user account
  resultUser: [], // vendor user account
  loadingUser: false,
  errorUser: null,
  loadingVendor: false,  //update a vendor
}

export default function vendorAccountReducer(state = initialState, action) {
  switch (action.type) {
    // Get all vendor accounts
    case type.GET_VENDOR_ACCOUNT_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case type.GET_VENDOR_ACCOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        vendors: action.vendors.data,
      }
    case type.GET_VENDOR_ACCOUNT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message,
      }
    // Get a vendor account by access code
    case type.GET_VENDOR_ACCOUNT_BY_ACCESS_CODE_REQUESTED: 
      return {
        ...state,
        loading: true,
      }
    case type.GET_VENDOR_ACCOUNT_BY_ACCESS_CODE_SUCCESS: 
      return {
        ...state,
        loading: false,
        vendor: action.vendors.data,
      }
    case type.GET_VENDOR_ACCOUNT_BY_ACCESS_CODE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message
      }
    // Post a vendor
    case type.POST_VENDOR_ACCOUNT_REQUESTED: 
      return {
        ...state,
        loading: true,
      }
    case type.POST_VENDOR_ACCOUNT_SUCCESS: 
      return {
          ...state,
          loading: false,
          vendor: action.vendors
        }
    case type.POST_VENDOR_ACCOUNT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message
      }
    // Put (update) a vendor
    case type.PUT_VENDOR_ACCOUNT_REQUESTED: 
      return {
        ...state,
        loadingVendor: true,
      }
    case type.PUT_VENDOR_ACCOUNT_SUCCESS: 
      return {
          ...state,
          loadingVendor: false,
          result: action.result
        }
    case type.PUT_VENDOR_ACCOUNT_FAILED:
      return {
        ...state,
        loadingVendor: false,
        error: action.message
      }
    // Post a vendor user
    case type.POST_VENDOR_USER_REQUESTED: 
      return {
        ...state,
        loadingUser: true,
      }
    case type.POST_VENDOR_USER_SUCCESS: 
      return {
          ...state,
          loadingUser: false,
          resultUser: action.user
        }
    case type.POST_VENDOR_USER_FAILED:
      // console.log('POST_VENDOR_USER_FAILED')
      return {
        ...state,
        loadingUser: false,
        errorUser: action.message
      }
    // Put (update) a vendor user
    case type.PUT_VENDOR_USER_REQUESTED: 
      return {
        ...state,
        loadingUser: true,
      }
    case type.PUT_VENDOR_USER_SUCCESS: 
      return {
          ...state,
          loadingUser: false,
          resultUser: action.result
        }
    case type.PUT_VENDOR_USER_FAILED:
      return {
        ...state,
        loadingUser: false,
        errorUser: action.message
      }
    //          
    default:
      return state
  }
}
