import * as type from '../types'

const initialState = {
  accountAll: [], //Get all accounts
  account: [],
  loading: false,
  error: null,
}

export default function accountReducer(state = initialState, action) {
  switch (action.type) {
    // Get all accounts
    case type.GET_ACCOUNT_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case type.GET_ACCOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        accountAll: action.accounts.accounts,
      }
    case type.GET_ACCOUNT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message,
      }
    // Get an account by user email
    case type.GET_ACCOUNT_EMAIL_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case type.GET_ACCOUNT_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        account: action.account.data,
      }
    case type.GET_ACCOUNT_EMAIL_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message,
      }   
    // Get an account by user id
    case type.GET_ACCOUNT_ID_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case type.GET_ACCOUNT_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        account: action.account.data,
      }
    case type.GET_ACCOUNT_ID_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message,
      }        
    default:
      return state
  }
}
