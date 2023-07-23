import * as type from '../types';

const initialState = {
  questions: [], //all imedical questionnaires
  loading: false,
  error: null,
}

export default function medicalQuestionReducer(state = initialState, action) {
  switch(action.type) {   
    // Get all medical questionnaires
    case type.GET_MED_QUESTION_REQUESTED: 
      return {
        ...state,
        loading: true,
      }
    case type.GET_MED_QUESTION_SUCCESS: 
      return {
        ...state,
        loading: false,
        questions: action.questions.data.rows
      }
    case type.GET_MED_QUESTION_FAILED:
      return {
        ...state,
        loading: false,
        error: action.message
      }    
    default:
      return state;
  }
}
