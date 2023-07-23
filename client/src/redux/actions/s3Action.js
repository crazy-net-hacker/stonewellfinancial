import * as type from '../types'

// GET 
export function getFileFromS3(criteriaData) {
  // console.log('criteriaData',criteriaData)
  return {
    type: type.GET_FILE_FROMS3_REQUESTED,
    payload: criteriaData,
  }
}

// GET multi files
export function getMultiFilesFromS3(criteriaData) {
  // console.log('criteriaData',criteriaData)
  return {
    type: type.GET_MULTIFILES_FROMS3_REQUESTED,
    payload: criteriaData,
  }
}