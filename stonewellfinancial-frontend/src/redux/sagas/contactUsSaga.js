import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

// post contact us
function postContactUs(value) {
  return axios.post(`${API_URL}api/v1/contactus/add`, value.payload)
      .then(res => {
        // console.log('saga- result',res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in Contact Us saga: "+ error)
        return error
      })
}

function* fetchPostContactUs(value) {
  try {
    const result = yield call(postContactUs, value);
    yield delay(500)
    yield put({ type: 'POST_CONTACT_US_SUCCESS', result: result});
  } catch(e) {
    yield put({ type: 'POST_CONTACT_US_FAILED', message: e.message });

  }
}


function* ContactUsSaga() {
  yield takeEvery('POST_CONTACT_US_REQUESTED', fetchPostContactUs);
}

export default ContactUsSaga