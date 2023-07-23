import { all } from 'redux-saga/effects'
import countrySaga from './countrySaga'
import clinicSaga from './clinicSaga'
import travelQuoteSaga from './travelQuoteSaga'
import medicalQuestionSaga from './medicalQuestionSaga'
import quotationSaga from './quotationSaga'
import accountSaga from './accountSaga'
import userSaga from './userSaga'
import studentPlanGroupSaga from './studentPlanGroupSaga'
import insurancePlanSaga from './insurancePlanSaga'
import vendorAccountSaga from './vendorAccountSaga'
import insuredPersonSaga from './insuredPersonSaga'
import travelApplicationSaga from './travelApplicationSaga'
import refundSaga from './refundSaga'
import salesSaga from './salesSaga'
import lifeQuoteSaga from './lifeQuoteSaga'
import healthQuoteSaga from './healthQuoteSaga'
import groupQuoteSaga from './groupQuoteSaga'
import contactUsSaga from './contactUsSaga'
import s3Saga from './s3Saga'
import emailSaga from './emailSaga'
import ClaimCaseSaga from './ClaimCaseSaga'
import creditcardSaga from './creditcardSaga'

export default function* rootSaga() {
  yield all([
    countrySaga(),
    clinicSaga(),
    travelQuoteSaga(),
    medicalQuestionSaga(),
    quotationSaga(),
    accountSaga(),
    userSaga(),
    studentPlanGroupSaga(),
    insurancePlanSaga(),
    vendorAccountSaga(),
    insuredPersonSaga(),
    travelApplicationSaga(),
    refundSaga(),
    salesSaga(),
    lifeQuoteSaga(),
    healthQuoteSaga(),
    groupQuoteSaga(),
    contactUsSaga(),
    s3Saga(),
    emailSaga(),
    ClaimCaseSaga(),
    creditcardSaga()
  ])
}
