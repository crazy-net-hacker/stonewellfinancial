import * as type from '../types';

// send policy email to client (insured)
export function sendEmailToClient(data) {
  // console.log('sendEmailToClient- action', data)
  return {
    type: type.SEND_EMAIL_CLIENT_REQUESTED,
    payload: data,
  }
}

