import axios from 'axios'
import { call, put, takeEvery, delay } from 'redux-saga/effects';

import API_URL from '../../utils/api_url';

// get one file
function getFileFromS3(value) {
  const parmsValues = Object.values(value.payload);
  // console.log('parmsValues',parmsValues)
 return axios.get(`${API_URL}api/v1/s3_documents/type=${parmsValues[0]}&fileName=${parmsValues[1]}`)
     .then(res => {
       return res.data
     }).catch((error)=>{
       // console.log("error in s3_documents saga: "+ error)
       return error
     })
}

function* fetchFileFromS3(value) {
  try {
    const file = yield call(getFileFromS3,value);
    yield delay(500)
    yield put({ type: 'GET_FILE_FROMS3_SUCCESS', file: file});
  } catch(e) {
    yield put({ type: 'GET_FILE_FROMS3_FAILED', message: e.message });

  }
}

// get multi files
function getMultiFilesFromS3(value) {

  // console.log('value',value.payload)
  const parmsValues = value.payload;
  // console.log('buildParams(parmsValues)',buildParams(parmsValues))

 return axios.get(`${API_URL}api/v1/s3_documents/search?type=${parmsValues.type}&fileName=${parmsValues.fileName}`)
     .then(res => {
       return res.data
     }).catch((error)=>{
       // console.log("error in s3_documents saga: "+ error)
       return error
     })
}

// const buildParams = (search) => {
//   if (!search) return "";

//   const params = new URLSearchParams();

//   Object.entries(search).forEach(([key, value]) => {
//     if (Array.isArray(value)) params.append(key, value.join(","));
//     else params.append(key, value.toString());
//   });

//   return `${params}`;
// };


function* fetchMultiFilesFromS3(value) {
  try {
    const files = yield call(getMultiFilesFromS3,value);
    // console.log('files in saga',files)
    yield delay(500)
    yield put({ type: 'GET_MULTIFILES_FROMS3_SUCCESS', multiFiles: files});
  } catch(e) {
    yield put({ type: 'GET_MULTIFILES_FROMS3_FAILED', message: e.message });

  }
}

function* s3Sags() {
  yield takeEvery('GET_MULTIFILES_FROMS3_REQUESTED', fetchMultiFilesFromS3);
  yield takeEvery('GET_FILE_FROMS3_REQUESTED', fetchFileFromS3);
}

export default s3Sags