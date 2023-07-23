import * as type from '../types';

export function getCountry(countries) {
  return {
    type: type.GET_COUNTRY_REQUESTED,
    payload: countries,
  }
}

export function getProvince(provinces) {
  return {
    type: type.GET_PROVINCE_REQUESTED,
    payload: provinces,
  }
}
