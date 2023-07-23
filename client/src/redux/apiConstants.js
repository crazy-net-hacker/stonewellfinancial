import API_URL from '../utils/api_url'

/** Base URL Definition settings for Development or Production based
 * from container enviroment
 */
export const BASE_URL =
  process.env.NODE_ENV === 'production' ? GetHostURL() : GetLocalDevURL()

/** Native JS functions that calls out location origin reference */
export function GetHostURL() {
  return `${window.location.origin}/`
}


/** Dev env validation, for static BASE URI connection */
export function GetLocalDevURL() {
  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/'
    : null
}

// export const API_SIGNUP_REQUEST = `${BASE_URL}api/v1/accounts/sign-up`
// export const API_SIGNIN_REQUEST = `${BASE_URL}api/v1/accounts/sign-in`
// export const API_SIGN_OUT_REQUEST = `${BASE_URL}api/v1/accounts/sign-out`
// export const API_GET_INSURANCE_BY_TYPE = `${BASE_URL}api/v1/travele_quotes/insurance`

export const API_SIGNUP_REQUEST = `${API_URL}api/v1/accounts/sign-up`
export const API_SIGNIN_REQUEST = `${API_URL}api/v1/accounts/sign-in`
export const API_SIGN_OUT_REQUEST = `${API_URL}api/v1/accounts/sign-out`
// export const API_VERIFY_EMAIL_REQUEST = `${API_URL}api/v1/accounts/verify/type`
export const API_GET_INSURANCE_BY_TYPE = `${API_URL}api/v1/travele_quotes/insurance`
