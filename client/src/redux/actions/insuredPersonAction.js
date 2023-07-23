import * as type from '../types';

export function getInsuredPersonByVendor(data) {
  return {
    type: type.GET_INSURED_BY_VENDOR_REQUESTED,
    payload: data,
  }
}

