import * as type from '../types'

const initialState = {
  file: [],
  loading: false,
  error: null,
  multiFiles: [],
  multiFilesLoading: false,
  multiFilesError: null,
}

export default function s3Reducer(state = initialState, action) {
  switch (action.type) {
    // get one file
    case type.GET_FILE_FROMS3_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case type.GET_FILE_FROMS3_SUCCESS:
      return {
        ...state,
        loading: false,
        file: action.file.file,
      }
    case type.GET_FILE_FROMS3_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message,
      }
    // get multi files
    case type.GET_MULTIFILES_FROMS3_REQUESTED:
      return {
        ...state,
        multiFilesLoading: true,
      }
    case type.GET_MULTIFILES_FROMS3_SUCCESS:
      return {
        ...state,
        multiFilesLoading: false,
        multiFiles: action.multiFiles,
      }
    case type.GET_MULTIFILES_FROMS3_FAILED:
      return {
        ...state,
        multiFilesLoading: false,
        multiFilesError: action.message,
      }
    default:
      return state
  }
}
