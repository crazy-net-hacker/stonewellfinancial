import { Token, UserRole, LocalStoreKeys } from './constants'

export function hasChildren(item) {
  const { items: children } = item

  if (children === undefined) {
    return false
  }

  if (children.constructor !== Array) {
    return false
  }

  if (children.length === 0) {
    return false
  }

  return true
}

export function GetFromLocalStore(key, isJSON) {
  // Check if key exists
  if (localStorage.getItem(key) === null) return false
  // Check flag
  //const jsonFlag = typeof isJSON !== 'undefined' ? isJSON : false
  let dataFromLocalStore = localStorage.getItem(key)

  // // Validate if KEY is exempted, when false decrypt values
  // if (!CheckIfExemptForEncryption(key)) {
  //   // Get Value and Start to Decrypt
  //   dataFromLocalStore = DecryptValue(dataFromLocalStore, jsonFlag)
  // }

  return dataFromLocalStore || ''
}

/** Functions and Methods */
export function SaveToLocalStore(key, data) {
  let valToBeSaved = data
  /**
   * Validate if KEY is exempted save non encrypted, otherwise encrypt
  //  */
  // if (!CheckIfExemptForEncryption(key)) {
  //   // Get Value and Start to Encrypt
  //   valToBeSaved = EncryptValue(JSON.stringify(data));
  // }

  // Save Encrypted data to Key
  localStorage.setItem(key, valToBeSaved)
}

// Remove and get clear all Storage
export function ClearTheLocalStore() {
  LocalStoreKeys.map(itemKey => RemoveFromLocalStore(itemKey))
}

// Remove specific item from the Local Storage
export function RemoveFromLocalStore(key) {
  return localStorage.removeItem(key)
}
/**
 *
 * Check if token is present . This indicates user is authenticated
 * TODO: Check if expired (not sure if that is needed)
 */
export function IsLoggedIn() {
  const token = GetFromLocalStore(Token, false)

  if (token) {
    return true
  }
  return false
}

export function GetUserRole() {
  const role = GetFromLocalStore(UserRole, false)

  if (role) {
    return role
  }
  return false
}
