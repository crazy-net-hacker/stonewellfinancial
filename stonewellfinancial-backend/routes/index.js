const express = require('express')
const router = express.Router()

const schedule = require("./schedule");

router.use('/api/v1/accounts', require('./accounts'))
router.use('/api/v1/authentication', require('./authentication'))

router.use('/api/v1/vendor_accounts', require('./vendor_accounts'))

router.use('/api/v1/insured_persons', require('./insured_persons'))
router.use('/api/v1/life_quotes', require('./life_quotes'))
router.use('/api/v1/health_quotes', require('./health_quotes'))
router.use('/api/v1/group_quotes', require('./group_quotes'))

router.use('/api/v1/insurance_plans', require('./insurance_plans'))

router.use('/api/v1/travel_applications', require('./travel_applications'))

router.use('/api/v1/travel_quotes', require('./travel_quotes'))

router.use('/api/v1/insured_refunds', require('./insured_refunds'))

router.use('/api/v1/medical_questions', require('./medical_questions'))

router.use('/api/v1/sales', require('./sales'))

router.use('/api/v1/zcrm_applications', require('./zcrm_applications'))

router.use('/api/v1/countries', require('./countries'))

router.use('/api/v1/clinics', require('./clinics'))
router.use('/api/v1/contactus', require('./contactus'))

router.use('/api/v1/insurance_companies', require('./insurance_companies'))
router.use('/api/v1/insurance_categories', require('./insurance_categories'))

router.use('/api/v1/claim_cases', require('./claim_cases'))

router.use('/api/v1/sendemail', require('./email'))

router.use('/api/v1/s3_documents', require('./s3_documents'))

router.use('/api/v1/credit_card', require('./credit_card'))
router.use('/api/v1/chatbot_dialogflow', require('./chatbot_dialogflow'))

schedule.schedule_job();


module.exports = router
