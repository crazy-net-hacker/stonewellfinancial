import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

// get medical questionnaires
function getMedicalQuestion(value) {
  return axios.get(`${API_URL}api/v1/medical_questions/`)
      .then(res => {
        // console.log(res.data)
        return res.data
      }).catch((error)=>{
        // console.log("error in medical question saga: "+ error)
        return error
      })
}

function* fetchMedicalQuestion(value) {
  try {
    const questions = yield call(getMedicalQuestion, value);
    yield delay(500)
    yield put({ type: 'GET_MED_QUESTION_SUCCESS', questions: questions});
  } catch(e) {
    yield put({ type: 'GET_MED_QUESTION_FAILED', message: e.message });

  }
}

function* medicalQuestionSaga() {
  yield takeEvery('GET_MED_QUESTION_REQUESTED', fetchMedicalQuestion);
}

export default medicalQuestionSaga