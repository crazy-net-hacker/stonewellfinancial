import * as type from '../types';


export function postContactUs(formData) {
  // console.log('postContactUs- action', formData)
  return {
    type: type.POST_CONTACT_US_REQUESTED,
    payload: formData,
  }
}


