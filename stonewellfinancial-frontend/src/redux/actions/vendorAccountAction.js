import * as type from '../types'

export function getVendorAccount(vendors) {
  return {
    type: type.GET_VENDOR_ACCOUNT_REQUESTED,
    payload: vendors,
  }
}

export function getVendorAccountByAccessCode(accessCode) {
  return {
    type: type.GET_VENDOR_ACCOUNT_BY_ACCESS_CODE_REQUESTED,
    payload: accessCode,
  }
}

export function postVendorAccount(formData) {
  // console.log('postVendorAccount- action', formData)
  return {
    type: type.POST_VENDOR_ACCOUNT_REQUESTED,
    payload: formData,
  }
}

export function updateVendorAccount(updateData) {
  // console.log('updateVendorAccount- action', updateData)
  return {
    type: type.PUT_VENDOR_ACCOUNT_REQUESTED,
    payload: updateData,
  }
}

export function postVendorUser(data) {
  return {
    type: type.POST_VENDOR_USER_REQUESTED,
    payload: data,
  }
}

export function updateVendorUser(updateData) {
  // console.log('updateVendorUserAccount- action', updateData)
  return {
    type: type.PUT_VENDOR_USER_REQUESTED,
    payload: updateData,
  }
}
