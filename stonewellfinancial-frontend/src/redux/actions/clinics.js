import * as type from '../types'

export function getClinic(clinics) {
  return {
    type: type.GET_CLINIC_REQUESTED,
    payload: clinics,
  }
}

export function getClinicDistance(clinics) {
  return {
    type: type.GET_CLINIC_DISTANCE_REQUESTED,
    payload: clinics,
  }
}
