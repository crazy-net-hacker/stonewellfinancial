import * as type from '../types';

export function getMedicalQuestion(questions) {
  return {
    type: type.GET_MED_QUESTION_REQUESTED,
    payload: questions,
  }
}

