import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

// send email to client (insured)
function sendEmailClient(value) {
  return axios.post(`${API_URL}api/v1/sendemail/send_email`, value.payload)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error sending email in email saga: "+ error)
        return error
      })
}

function* fetchSendEmailClient(value) {
  try {;
    const result = yield call(sendEmailClient, value);
    yield delay(500)
    yield put({ type: 'SEND_EMAIL_CLIENT_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'SEND_EMAIL_CLIENT_FAILED', message: e.message });

  }
}


function* TravelApplicationSaga() {
  yield takeEvery('SEND_EMAIL_CLIENT_REQUESTED', fetchSendEmailClient);
}

export default TravelApplicationSaga