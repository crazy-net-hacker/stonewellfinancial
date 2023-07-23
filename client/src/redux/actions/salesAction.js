import * as type from '../types';


// export function getVendorStatements(criteriaData) {
//   return {
//     type: type.GET_VENDORSTATEMENT_REQUESTED,
//     payload: criteriaData,
//   }
// }

export function getVendorStatementsByVendor(vendorID) {
  return {
    type: type.GET_VENDORSTATEMENT_BY_VENDOR_REQUESTED,
    payload: vendorID,
  }

}



