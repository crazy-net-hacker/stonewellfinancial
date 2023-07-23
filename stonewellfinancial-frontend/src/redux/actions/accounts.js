import * as type from '../types'

// get all accounts
export function getAccountAll(accounts) {
  return {
    type: type.GET_ACCOUNT_REQUESTED,
    payload: accounts,
  }
}

// get account by email
export function getAccountByEmail(userEmail) {
  return {
    type: type.GET_ACCOUNT_EMAIL_REQUESTED,
    payload: userEmail,
  }
}

// get account by user
export function getAccountByUserId(userId) {
  return {
    type: type.GET_ACCOUNT_ID_REQUESTED,
    payload: userId,
  }
}
