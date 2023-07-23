import { combineReducers } from 'redux'
import countryReducer from './countries'
import clinicReducer from './clinics'
import travelQuoteReducer from './travelQuotes'
import medicalQuestionReducer from './medicalQuestions'
import quotationReducer from './quotations'
import accountReducer from './accounts'
import { signUpReducer, signInReducer, resetPasswordReducer, userAccountReducer } from './userReducer'
import insuredPersonReducer from './insuredPersonReducer'
import insurancePlanReducer from './insurancePlanReducer'
import studentPlanGroupReducer from './studentPlanGroupReducer'
import vendorAccountReducer from './vendorAccountReducer'
import travelApplicationReducer from './travelApplicationReducer'
import salesReducer from './salesReducer'
import lifeQuoteReducer from './lifeQuoteReducer'
import healthQuoteReducer from './healthQuoteReducer'
import groupQuoteReducer from './groupQuoteReducer'
import refundReducer from './refundReducer'
import contactUsReducer from './contactUsReducer'
import s3Reducer from './s3Reducer'
import emailReducer from './emailReducer'
import cliamCaseReducer from './cliamCaseReducer'
import creditcardReducer from './creditcardReducer'

const rootReducer = combineReducers({
  countryReducer,
  clinicReducer,
  travelQuoteReducer,
  medicalQuestionReducer,
  quotationReducer,
  accountReducer,
  signIn: signInReducer,
  signUp: signUpReducer,
  resetPassword: resetPasswordReducer,
  userAccountReducer,
  insurancePlanReducer,
  insuredPersonReducer,
  studentPlanGroupReducer,
  vendorAccountReducer,
  travelApplicationReducer,
  refundReducer,
  salesReducer,
  lifeQuoteReducer,
  healthQuoteReducer,
  groupQuoteReducer,
  contactUsReducer,
  s3Reducer,
  emailReducer,
  cliamCaseReducer,
  creditcardReducer
})

export default rootReducer
