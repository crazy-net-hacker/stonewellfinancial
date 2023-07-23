require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')
const moment = require('moment')
const common  = require('./common')
const zcrmAPI = require('./zoho_crm_APIs')
const tugoAPI = require('./tugo_APIs')
const carewellzcrmAPI = require('./zoho_carewell_crm_APIs')

const mailer = require('../middlewares/emailService/mailer')
const applicationUpdatedNotice = require('../middlewares/emailService/templates/applicationUpdatedNotice')
const applicationReturnedNotice = require('../middlewares/emailService/templates/applicationReturnedNotice')
const applicationVoidNotice = require('../middlewares/emailService/templates/applicationVoidNotice')
const applicationDraftNotice = require('../middlewares/emailService/templates/applicationDraftNotice')

const InsuranceExpirationNotice = require('../middlewares/emailService/templates/InsuranceExpirationNotice')

const multer = require('multer')
const storage = multer.memoryStorage()

const upload = multer({ storage }).fields([
  { name: 'UploadFiles', maxCount: 5 }
])
// const upload = multer({ storage })
const sendToS3 = require('../middlewares/awsS3/sendToS3')

const provinces = [
  {province_code:'AB',	province_name: 'Alberta'},
  {province_code:'BC',	province_name: 'British Columbia'},
  {province_code:'MB',	province_name: 'Manitoba'},
  {province_code:'NB',	province_name: 'New Brunswick'},
  {province_code:'NL',	province_name: 'Newfoundland and Labrador'},
  {province_code:'NT',	province_name: 'Northwest Territories'},
  {province_code:'NS',	province_name: 'Nova Scotia'},
  {province_code:'NU',	province_name: 'Nunavut'},
  {province_code:'ON',	province_name: 'Ontario'},
  {province_code:'PE',	province_name: 'Prince Edward Island'},
  {province_code:'QC',	province_name: 'Quebec'},
  {province_code:'SK',	province_name: 'Saskatchewan'},
  {province_code:'YT',	province_name: 'Yukon Territory'},
]
  
// GET Travel Application
router.get('/fr=:fr&to=:to&vendor_id=:vendor_id', async(req, res) => {
  try {
    // console.log('travel_applications.js get /')
    // console.log(`travel_applications.js get /fr=:fr&to=:to`)
    let sql_zcrm = applicationSqlStatement_zcrm() + ' ' + 
              `where app.application_date between '${req.params.fr}' and '${req.params.to}'
                and app.vendor_id like '${req.params.vendor_id==='*'?'%':req.params.vendor_id}'
              `
    let sql_zcrm_refund = applicationSqlStatement_zcrm() + ' ' +
              `join (select z.application_date, ir.policy_number
                        from insured_refund ir
                        join zoho_sales_orders z on z.zoho_sales_id = ir.application_id 
                        where (ir.request_date between '${req.params.fr}' and '${req.params.to}'
                                or ir.refund_date between '${req.params.fr}' and '${req.params.to}') 
                        and ir.vendor_id like '${req.params.vendor_id==='*'?'%':req.params.vendor_id}'
                        and z.application_date <> ir.request_date
                        group by z.application_date, ir.policy_number
                    ) r on r.application_date = app.application_date and r.policy_number = app.policy
              `      
    let sql_origin = applicationSqlStatement() + ' ' + 
              `where app.application_date between '${req.params.fr}' and '${req.params.to}'
                and v.vendor_id like '${req.params.vendor_id==='*'?'%':req.params.vendor_id}'
              `
    let sql_origin_refund = applicationSqlStatement() + ' ' + 
              `where app.application_id in (select ir.application_id 
                                              from insured_refund ir 
                                              where (ir.request_date between '${req.params.fr}' and '${req.params.to}'
                                                      or ir.refund_date between '${req.params.fr}' and '${req.params.to}') 
                                                and ir.vendor_id like '${req.params.vendor_id==='*'?'%':req.params.vendor_id}'
                                                and ir.application_id not in (select application_id 
                                                                                from application
                                                                                where application_date between '${req.params.fr}' and '${req.params.to}'
                                                                                )
                                              group by ir.application_id)
              `
    let sql_merge = `select * from (${sql_zcrm} union all ${sql_zcrm_refund} union all ${sql_origin} union all ${sql_origin_refund}) app order by app_date, application_id ` 
    // console.log(sql_origin)

    pool.query(sql_merge, function (err, result) {
      if (!err) {
        res.status(200).json({ data: result.rows })
        // console.log(result.rows)
      }
      else{
        res.status(200).json({ data: [] })
        // console.error(err.message)
      }
    })

  } catch (err) {
    res.send({ error: 'something wrong' })  
    // console.error(err.message)
  }
})


// GET Travel Applications by user_id
router.get('/list/user_id=:user_id', async(req, res) => {
  try {
    // console.log('travel_applications.js get /list/user_id=:user_id')

    const searchSql = `select application_id from application a 
                    where created_by = '${req.params.user_id}'
                    and source_from = 'C'`;
    const searchRes = await pool.query(searchSql)
    if (searchRes.rowCount > 0){
      let sql = clientApplicationGetSql(searchRes.rows.map(r => `'${r.application_id}'`).join())
      const result =  await pool.query(sql)
      if (result.rowCount > 0){
        return res.status(200).json({ data: result.rows })
      } else{
        return res.status(200).json({ data: [] })
      }
    
    } else{
      return res.status(200).json({ data: [] })
    }
  } catch (err) {
    res.send({ error: 'something wrong' })  
    // console.error(err.message)
  }
})

// GET Travel Applicant's medical questionnaire
router.get('/med-questionnaire/application_id=:application_id&insured_id=:insured_id', (req, res) => {
    try {
      // console.log(`travel_applications.js get /med-questionnaire/applicaion_id='${req.params.application_id}'&insured_id='${req.params.insured_id}'`)
      let sql = `select questionnaire_id,
                        question_code,
                        header_content_en,
                        header_content_kr,
                        content_en,
                        content_kr,
                        input_type,
                        answer
                  from insured_medical_answer
                            where application_id = '${req.params.application_id}'
                            and insured_person_id = '${req.params.insured_id}'
                `  
      pool.query(sql, function (err, result) {
        if (!err) {
          return res.status(200).json({ data: result })
        }
        else{
          res.status(400).json({ message: err})
          console.error(err.message)
        }
      })
    } catch (err) {
      res.status(400).json({ message: err})
      console.error(err.message)
    }
  })

// Get Renewable insurance 
// Application for renewal: 0 days, 14 days from the expiration date
router.get('/renewable', async(req, res) => {
  try {
    // console.log('travel_applications.js get /renewable')
    const sql = renewableApplicationSqlStatement() 
    // console.log(sql)
    const result = await pool.query(sql)
    if (result.rowCount > 0){
        return res.status(200).json({ data: result.rows })
      } else{
        return res.status(200).json({ data: [] })
      }
    
  } catch (err) {
    res.send({ error: 'something wrong' })  
    // console.error(err.message)
  }
})

// send email after Gettting Renewable Application
// Application for renewal: 0 days, 14 days from the expiration date
router.get('/send_email/renewable', async(req, res) => {
  try {
    // console.log('travel_applications.js get /send_email/renewable')

    const responseResult = await sendExpireNoticEmail()

    return res.status(200).json({
      "status": responseResult.status,
      "message": responseResult.message,
    })


  } catch (err) {
    res.send({
      "status":"error",
      "message": "Something went wrong",
      })  
    // console.error(err.message)
  }
})

// sendExpireNoticEmail
function sendExpireNoticEmail () {

  return new Promise(async (resolve, reject) => {
    try{
        // console.log('travel_applications.js function: sendExpireNoticEmail ') 
        var SendingEmailCount = 0;

        const sql = renewableApplicationSqlStatement() 
        // console.log(sql)
        const result = await pool.query(sql)
        if (result.rowCount > 0){
            // send email only vendor allows email to client
            // do not send email to insureds who have CANADIAN SINGLE plan 
            // group by email, insurance_company, insured_type
            const applications = result.rows.filter(f=>f.allow_email_client === true &&
                                                    (f.insured_type === 'CANADIAN'
                                                      ? f.trip_type === 'MULTI'
                                                      : f.trip_type !== '' )
                                              )
                                            .map(i=>({
                                                  email : i.email,
                                                  insurance_company : i.insurance_company,
                                                  insured_type : i.insured_type,
                                                  persons: i
                                            }))
            
            // console.log('applications',applications)
            const applicationByCompany = common.groupBykeys(applications, ['email','insurance_company', 'insured_type'], ['persons'], 'detail')
            
            // group by email
            const applicationCompanies = applicationByCompany.map(i=>({ email : i.email,
                      renewable_plan: i
            }))
            const renewableApplications = common.groupBykeys(applicationCompanies, ['email'], ['renewable_plan'], 'detail')

            if (renewableApplications && renewableApplications.length >0){

                for (i in renewableApplications){
                    SendingEmailCount += 1;
                    //sending email
                    let mailOptions = await InsuranceExpirationNotice.letterMailOptions(renewableApplications[i])
                    await mailer.sendEmail(mailOptions)     
                }
          }
        }

        resolve({status: 'success', message: `Sent to ${SendingEmailCount} email successfully`})

    } catch (err) {
      console.log('Error  : ', err.message )
      resolve({status: 'error', message: 'Something went wrong' })
    }
  })
}

// Send Draft Application Reminder Email to Vendor
async function sendDraftReminderEmails() {
  try {
    const sql = draftApplicationSqlStatement();

    const result = await pool.query(sql);

    if (result.rowCount > 0) {
      const promises = result.rows.map(async (row) => {
        let mailOptions = await applicationDraftNotice.letterMailOptions(row);
        await mailer.sendEmail(mailOptions);
      });

      await Promise.all(promises);

      return {
        status: 'success',
        message: `Reminder emails sent to ${result.rowCount} recipients.`
      };
    } else {
      return {
        status: 'success',
        message: 'No draft applications found for sending reminders.'
      };
    }
  } catch (error) {
    console.error('Error sending reminder emails:', error);
    return {
      status: 'error',
      message: 'An error occurred while sending reminder emails.'
    };
  }
}




// Create new Travel 
router.post('/add', async(req, res) => {
  try {
        // console.log('travel_applications.js post /add')
        // console.log('*** Travel appliation is submitting... ***')
        
        req.body.submitType = req.body.submitType ? req.body.submitType : 'submit';
        // process status
        req.body.status = req.body.submitType
                          ? (req.body.submitType === 'draft'?'Draft':'Pending') 
                          : 'Pending';
        
        // mailing address
        let mailAddress = {
              addressType: '',
              street: req.body.mailStreetName,
              suiteNo: req.body.mailUnitApartmentNo,
              city: req.body.mailCity,
              province: req.body.mailProvince,
              postalcode: req.body.mailPostalCode,
              country: req.body.mailCountry,
              useType: 'Mailling',
              isMailing: false
            };

        const applicationResult = await travelApplication(req.body)
        const application = applicationResult.row
        if (application){
            const insuredPlanResult = await insuredPlanInfo('Travel', application.application_id, req.body)          
            if (insuredPlanResult.status === 200){
                  // address => single data based on primary contact address in
                  await common.addressInfo('Travel', application.application_id, mailAddress)
                  // payment => single data based on total price at application
                  await insuredPaymentInfo('Travel', application.application_id, req.body, application.total_amount)
                  // // update note
                  await applicationNoteInfo(application.application_id, req.body.note, req.body.userID)
              
            } // if addingInsuredPlanResult == 200

            if (!req.body.currentStatus && req.body.submitType === 'submit'){
              // send confirmation email
              // get data
              const collectData = await common.getData(applicationGetSql(application.application_id));
              collectData.data.contact_name = collectData.data.contact_name.replace(/\s/g, "_");

              const sendingEmailResult = await common.sendConfirmEmail('Travel', collectData.data)
              // check result
              if (sendingEmailResult.status !== 200){
                  // console.log(sendingEmailResult.message)
                  errorResult.push({step: 'sendingEmailResult', status: sendingEmailResult.status, message:sendingEmailResult.message})
              }
            }

        } //if (application)


        res.status(200).json({
          "status":"success",
          "message": "Travel application have been done successfully",
          "data": req.body.submitType === 'submit'?application.confirmation_no:application.application_id
          })
        
        // console.log(`*** ${req.body.submitType==='submit'?'submission':req.body.submitType} done. ***`)
        // console.log(`*** ${req.body.submitType} done. ***`)

    } catch (err) {
      // console.error(err)
      // console.log('*** Error: Travel application is not submitted. ***')
      res.send({ err })    
      // should be make a rollback logic    
  }
})


// application
function travelApplication (data) {

  return new Promise(async (resolve, reject) => {
    
    try{

        // console.log('travel_application.js function: travelApplication ') 

        let totalPrice = 0;
        let insurancePlanPrice = 0 ;
        let deductAmount = 0;
        let carewellServicePrice = 0; 
        let insuranceCardFee = 0;
        let optionalPlanPrice = 0 ;
        // calculate total amout
        data.insuredPersons.forEach(person => {
          totalPrice += Math.round(((person.selectedPlan.calculatedInsuranceAmount ? person.selectedPlan.calculatedInsuranceAmount : 0)) * 100) / 100
          insurancePlanPrice += Math.round(((person.selectedPlan.insuranceAmount ? person.selectedPlan.insuranceAmount : 0)) * 100) / 100
          deductAmount += Math.round(((person.selectedPlan.calculatedDeductAmount ? person.selectedPlan.calculatedDeductAmount : 0)) * 100) / 100
          carewellServicePrice += Math.round((((person.optionalCarewellService.isSelected && person.optionalCarewellService.packageAmount) ? person.optionalCarewellService.packageAmount : 0)) * 100) / 100
          insuranceCardFee += Math.round((((person.physicalCard === true && person.physicalCardFee && person.physicalCardFee > 0 ) ? person.physicalCardFee : 0)) * 100) / 100
          person.optionalAddOnPlans.forEach(plan => {
                if (plan.compnayName === person.selectedPlan.compnayName){
                      plan.planTypes.forEach(planType => {
                        if (planType.isSelected === true){
                            optionalPlanPrice += Math.round(((planType.calculatedAddOnAmount ? planType.calculatedAddOnAmount : 0)) * 100) / 100
                            }  
                    });
                }
            });
        });

        totalPrice = totalPrice - data.familyGroup.discountPremium
        const searchSql = `select * from application where application_id = '${data.applicationID}'`
        const searchResult = await pool.query(searchSql)

        let currentDate = new Date().toISOString().slice(0, 10);
        let applicationResult = ''


        // add
        if (searchResult.rowCount === 0) {
            let sql = `insert into application ( application_date, insured_type, travel_direction_type, insured_group_type,
                                                  insured_person_num, 
                                                  insurance_plan_price, deduct_amount, insurance_amount, option_plan_price, carewell_service_price, insurance_card_fee, total_amount,
                                                  family_plan_amount, family_plan_discount,
                                                  contact_name, 
                                                  mailling_in, is_canada_phone, email, phone, app_status, 
                                                  vendor_id, source_from, renewal, source_chnnel, prefer_language, created_by ) 
                                          values ('${currentDate}', '${data.insuredPersons[0].eligilbeIns}', '${data.tripDirection}', '${data.insuredGroupType}',
                                                  ${data.insuredPersons.length}, 
                                                  ${insurancePlanPrice + deductAmount},  ${deductAmount}, ${insurancePlanPrice}, ${optionalPlanPrice}, ${carewellServicePrice}, ${insuranceCardFee}, ${totalPrice},
                                                  ${data.familyGroup.familyPremium}, ${data.familyGroup.discountPremium},
                                                  '${data.contactName?data.contactName:data.insuredPersons[0].firstName + ' ' + data.insuredPersons[0].lastName}', 
                                                  ${data.maillingInCanada}, ${data.phoneInCanada}, '${data.contactEmail}', '${data.contactPhone}', '${data.status?data.status:'Pending'}', 
                                                  '${data.vendorID?data.vendorID:'VEN0000010'}', '${data.sourceFrom?data.sourceFrom:'O'}', ${data.renewal}, '${data.sourceChnnel}', '${data.preferLanguage?data.preferLanguage:'en'}', '${data.userID}'
                                                  ) returning * `
            applicationResult = await pool.query(sql)

        }
        
        // update
        else{

              // var currentDate = new Date().toISOString().slice(0, 10);
              let sql = `update application 
                            set insured_type = $1 , 
                                travel_direction_type = $2 , 
                                insured_group_type = $3 ,
                                insured_person_num = $4 , 
                                insurance_plan_price = $5 , 
                                deduct_amount = $6 , 
                                insurance_amount = $7 , 
                                option_plan_price = $8 , 
                                carewell_service_price = $9 , 
                                insurance_card_fee = $10 , 
                                total_amount = $11 ,
                                family_plan_amount = $12 , 
                                family_plan_discount = $13 ,
                                contact_name = $14 , 
                                mailling_in = $15 , 
                                email = $16 , 
                                phone = $17 , 
                                app_status = $18 , 
                                source_from = $19 , 
                                renewal = $20 , 
                                source_chnnel = $21 , 
                                prefer_language = $22 , 
                                created_by = $23,
                                application_date = $24,
                                is_canada_phone = $25
                          where application_id = '${data.applicationID}' returning *`
              reqData = [
                          data.insuredPersons[0].eligilbeIns,  //$1
                          data.tripDirection, //$2
                          data.insuredGroupType,  //$3
                          data.insuredPersons.length, //$4
                          insurancePlanPrice + deductAmount,  //$5  
                          deductAmount,  //$6
                          insurancePlanPrice,  //$7
                          optionalPlanPrice,  //$8
                          carewellServicePrice,  //$9
                          insuranceCardFee,  //$10
                          totalPrice,  //$11
                          data.familyGroup.familyPremium,  //$12 
                          data.familyGroup.discountPremium,  //$13
                          data.contactName?data.contactName:data.insuredPersons[0].firstName + ' ' + data.insuredPersons[0].lastName,  //$14
                          data.maillingInCanada,  //$15
                          data.contactEmail,  //$16
                          data.contactPhone,  //$17travelApplication(data).then(response => {
                          data.status?data.status:'Pending',   //$18
                          data.sourceFrom?data.sourceFrom:'O',   //$19
                          data.renewal,  //$20
                          data.sourceChnnel, //$21 
                          data.preferLanguage?data.preferLanguage:'en',  //$22 
                          data.userID,  //$23
                          !data.currentStatus?currentDate:searchResult.rows[0].application_date,  //$24
                          data.phoneInCanada  //$25
                          ]

              applicationResult = await pool.query(sql, reqData)
              // console.log('Application update result:', applicationResult);
              

        }

        if (applicationResult.rowCount !== 0) {
          resolve({status: 200, message: 'success', row: applicationResult.rows[0] })
        }else{
          reject({status: 409, message: 'error'})
        }

      } catch (err) {
        // console.log('Handling travelApplication is fail  : ', err )
        reject(err.message)
        }
  })
}

// insured person plan information 
function insuredPlanInfo (sourceType, applicationID, data) {
  return new Promise(async (resolve, reject) => {
    try{
        // console.log('travel_application.js function: insuredPlanInfo ') 
        
        const person = data.insuredPersons

        // check to be deleted insured by currnt data
        const searchInsuredSql = `select * from insured_plan 
                where application_id = '${applicationID}' `
        const searchInsuredResult = await pool.query(searchInsuredSql)
        if (searchInsuredResult.rowCount !== 0){
          // privous Insured
          const privousInsured = searchInsuredResult.rows.map(i=>i.insured_person_id)
          // console.log('privousInsured',privousInsured)
          
          // currnt insured
          const currntInsured = []
          for (const i in person) {
            const personResult =  await common.searchInsuredPerson(person[i])
            currntInsured.push(personResult.personId)
          }
          // console.log('currntInsured',currntInsured)

          // find difference Insured
          // if different insured person(s) is(are) existed
          const differenceInsured = privousInsured.filter(x => !currntInsured.includes(x));
          // console.log('differenceInsured', differenceInsured)
          if (differenceInsured.length > 0){
              // delete insured_medical_answer
              const deleteMedicalSql = `delete from insured_medical_answer 
                                        where application_id = '${applicationID}' 
                                          and insured_person_id in (${differenceInsured.map(i => `'${i}'`).join()})`
              // console.log(deleteMedicalSql)
              await pool.query(deleteMedicalSql)
              // delete insured_plan_option
              const deleteOptionPlanSql = `delete from insured_plan_option 
                                            where application_id = '${applicationID}' 
                                              and insured_person_id in (${differenceInsured.map(i => `'${i}'`).join()})`
              // console.log(deleteOptionPlanSql)
              await pool.query(deleteOptionPlanSql)
              // delete insured_plan
              const deletePlanSql = `delete from insured_plan 
                                      where application_id = '${applicationID}' 
                                        and insured_person_id in (${differenceInsured.map(i => `'${i}'`).join()})`
              // console.log('deleteSql',deletePlanSql)
              await pool.query(deletePlanSql)
          }
          
        }


        // for
        for (const i in person) { 

          // set datetime as timezone at the moment 
          person[i].birthDate = common.momentTimeZone(person[i].birthDate, data.timeZone)
          person[i].tripStartDate = common.momentTimeZone(person[i].tripStartDate, data.timeZone)
          person[i].tripEndDate = common.momentTimeZone(person[i].tripEndDate, data.timeZone)
          
          // get insured person id
          let result =  await common.addInsuredPerson(sourceType, applicationID, person[i], data.timeZone)
          let insuredPersonID = result.personId

          let optionalPlanPrice = 0
          person[i].optionalAddOnPlans.forEach(plan => {
            if (plan.compnayName === person[i].selectedPlan.compnayName){
                  plan.planTypes.forEach(planType => {
                    if (planType.isSelected === true){
                        optionalPlanPrice += Math.round(((planType.calculatedAddOnAmount ? planType.calculatedAddOnAmount : 0)) * 100) / 100
                        }  
                  });
              }
          });

          let arrivalDate = null
          if (person[i].arrivalDate){
              arrivalDate = `'${common.momentTimeZone(person[i].arrivalDate,data.timeZone)}'`}

          // medical surcharge
          let chargeRate = '1'
          let medicalSurcharge = 0
          // let requiredMedicalAnswer = false
          if (person[i].selectedPlan.medicalQuestion && person[i].selectedPlan.medicalQuestion.answered === true){
              chargeRate = person[i].selectedPlan.medicalQuestion.chargeRate
              medicalSurcharge = person[i].selectedPlan.medicalQuestion.surcharge
              // requiredMedicalAnswer = true
          }

          // selected deduct
          let selectedDeduct = null
          if(person[i].selectedPlan.selectedDeduct){
            selectedDeduct = person[i].selectedPlan.selectedDeduct
          }else{
            selectedDeduct = 0
          }

          //insurance card delivery date
          let insuranceCardDeliveryDate = null
          if(person[i].deliverDateInsuranceCard){
            insuranceCardDeliveryDate = `'${common.momentTimeZone(person[i].deliverDateInsuranceCard, data.timeZone)}'`
          }

          //graduation date
          let graduationDate = null
          if(person[i].graduatedDate){
            graduationDate = `'${common.momentTimeZone(person[i].graduatedDate, data.timeZone)}'`
          }

          //search insured_plan
          const searchSql =  `select * from insured_plan where application_id = '${applicationID}' and insured_person_id = '${insuredPersonID}'`
          const searchResult = await pool.query(searchSql)
          
          let insuredResult = ''
          // add
          if (searchResult.rowCount === 0){
              const sql = `insert into insured_plan 
                          (application_id, insured_person_id, primary_contact, age, relationship,
                            origin_country, origin_province, 
                            destination_country, destination_province,
                            arrival_date, effective_date,  expiry_date, coverage_days, multi_trip_days,
                            travel_purpose_type, graduation_date, attend_school_name, beneficiary_fullname, benef_relation,
                            eligible_insured_type, eligible_status, trip_type, questionnaire_id, insurance_compnay_id,
                            insurance_plan_id, plan_coverage, 
                            plan_price, 
                            plan_medical_charged_price,
                            plan_deduct,
                            deduct_amount, 
                            insurance_amount, 
                            option_plan_price, 
                            carewell_service, 
                            carewell_service_price, 
                            insurance_card_issue, insurance_card_fee, insurance_card_delivery_date,
                            total_amount, 
                            charge_rate, renewal,
                            created_by )                
                            values ('${applicationID}', '${insuredPersonID}', ${person[i].relationship==='Primary'?true:false}, ${person[i].age}, '${person[i].relationship}',
                              '${person[i].originCountry?person[i].originCountry:data.originCountry}', '${person[i].originProvince?person[i].originProvince:data.originProvince}', 
                              '${person[i].destCountry?person[i].destCountry:data.destCountry}', '${person[i].destProvince?person[i].destProvince:data.destProvince}',
                              ${arrivalDate}, '${person[i].tripStartDate}', '${person[i].tripEndDate}', '${person[i].tripPeriod}', '${person[i].selectedPlan.tripType==='MULTI'?person[i].selectedPlan.coverages[0].trip_length_max:person[i].multiTripDays}',
                              '${person[i].travelType}', ${graduationDate}, '${person[i].attendSchoolName}', '${person[i].beneficiaryName}', '${person[i].beneficiaryRelationship}',
                              '${person[i].eligilbeIns}', ${data.eligilbeAgrement?data.eligilbeAgrement:true}, '${person[i].selectedPlan.tripType}', '${person[i].selectedMedQuesAnswer.length>0?person[i].selectedPlan.questionnaireID:''}', '${person[i].selectedPlan.compnayName}', 
                              '${person[i].selectedPlan.coverages[0].plan_id}', '${person[i].selectedPlan.selectedCoverage}', 
                              ${person[i].selectedPlan.insuranceAmount + (person[i].selectedPlan.calculatedDeductAmount?person[i].selectedPlan.calculatedDeductAmount:0)}, 
                              ${medicalSurcharge},
                              ${person[i].eligilbeIns==='STUDENT'?0:selectedDeduct},
                              ${person[i].selectedPlan.calculatedDeductAmount?person[i].selectedPlan.calculatedDeductAmount:0}, 
                              ${person[i].selectedPlan.insuranceAmount}, 
                              ${optionalPlanPrice},
                              '${person[i].optionalCarewellService.isSelected ? person[i].optionalCarewellService.packageName : ''}' ,
                              ${person[i].optionalCarewellService.isSelected ? person[i].optionalCarewellService.packageAmount : 0},
                              ${person[i].physicalCard?person[i].physicalCard:false}, ${person[i].physicalCardFee?person[i].physicalCardFee:0}, ${insuranceCardDeliveryDate},
                              ${person[i].selectedPlan.calculatedInsuranceAmount}, 
                              '${chargeRate}', ${person[i].renewalInsurance?person[i].renewalInsurance:false},
                              '${data.userID}'
                              ) returning * `
              insuredResult = await pool.query(sql)
          }
          // update
          else{
                const sql = `update insured_plan 
                                set primary_contact = $1 , 
                                    age = $2 , 
                                    relationship = $3 ,
                                    origin_country = $4 , 
                                    origin_province = $5 , 
                                    destination_country = $6 , 
                                    destination_province = $7 ,
                                    arrival_date = $8 , 
                                    effective_date = $9 ,  
                                    expiry_date = $10 , 
                                    coverage_days = $11 , 
                                    multi_trip_days = $12 ,
                                    travel_purpose_type = $13 , 
                                    graduation_date = $14 , 
                                    attend_school_name = $15 , 
                                    beneficiary_fullname = $16 , 
                                    benef_relation = $17 ,
                                    eligible_insured_type = $18 , 
                                    eligible_status = $19 , 
                                    trip_type = $20 , 
                                    questionnaire_id = $21 , 
                                    insurance_compnay_id = $22 ,
                                    insurance_plan_id = $23 , 
                                    plan_coverage = $24 , 
                                    plan_price = $25 , 
                                    plan_medical_charged_price = $26 ,
                                    plan_deduct = $27 ,
                                    deduct_amount = $28 , 
                                    insurance_amount = $29 , 
                                    option_plan_price = $30 , 
                                    carewell_service = $31 , 
                                    carewell_service_price = $32 , 
                                    insurance_card_issue = $33 , 
                                    insurance_card_fee = $34 , 
                                    insurance_card_delivery_date = $35 ,
                                    total_amount = $36 , 
                                    charge_rate = $37 , 
                                    renewal = $38 ,
                                    created_by = $39 
                              where application_id = '${applicationID}' and insured_person_id = '${insuredPersonID}' returning *`
                const reqData = [
                                person[i].relationship==='Primary'?true:false,  //$1
                                person[i].age,  //$2
                                person[i].relationship, //$3
                                person[i].originCountry?person[i].originCountry:data.originCountry,  //$4
                                person[i].originProvince?person[i].originProvince:data.originProvince,  //$5
                                person[i].destCountry?person[i].destCountry:data.destCountry, //$6
                                person[i].destProvince?person[i].destProvince:data.destProvince, //$7
                                arrivalDate,  //$8
                                person[i].tripStartDate,  //$9
                                person[i].tripEndDate,    //$10
                                person[i].tripPeriod,     //$11
                                person[i].selectedPlan.tripType==='MULTI'?person[i].selectedPlan.coverages[0].trip_length_max:person[i].multiTripDays,  //$12
                                person[i].travelType,     //$13
                                graduationDate,           //$14
                                person[i].attendSchoolName, //$15
                                person[i].beneficiaryName,  //$16
                                person[i].beneficiaryRelationship,  //$17
                                person[i].eligilbeIns,   //$18
                                data.eligilbeAgrement?data.eligilbeAgrement:true,  //$19
                                person[i].selectedPlan.tripType,  //$20
                                person[i].selectedMedQuesAnswer.length>0?person[i].selectedPlan.questionnaireID:'',  //$21
                                person[i].selectedPlan.compnayName,  //$22
                                person[i].selectedPlan.coverages[0].plan_id,  //$23
                                person[i].selectedPlan.selectedCoverage,  //$24
                                person[i].selectedPlan.insuranceAmount + (person[i].selectedPlan.calculatedDeductAmount?person[i].selectedPlan.calculatedDeductAmount:0),  //$25
                                medicalSurcharge,  //$26
                                person[i].eligilbeIns==='STUDENT'?0:selectedDeduct,  //$27
                                person[i].selectedPlan.calculatedDeductAmount?person[i].selectedPlan.calculatedDeductAmount:0,  //$28
                                person[i].selectedPlan.insuranceAmount, //$29
                                optionalPlanPrice,  //$30
                                person[i].optionalCarewellService.isSelected ? person[i].optionalCarewellService.packageName : '', //$31
                                person[i].optionalCarewellService.isSelected ? person[i].optionalCarewellService.packageAmount : 0, //$32
                                person[i].physicalCard?person[i].physicalCard:false,  //$33
                                person[i].physicalCardFee?person[i].physicalCardFee:0,  //$34
                                insuranceCardDeliveryDate, //$35
                                person[i].selectedPlan.calculatedInsuranceAmount, //$36 
                                chargeRate, //$36
                                person[i].renewalInsurance?person[i].renewalInsurance:false, //$37
                                data.userID //$39
                                ]
                
                insuredResult = await pool.query(sql, reqData)
          }

          if (insuredResult.rowCount !== 0) {
            // console.log(insuredPersonID + ' Insured plan (applicaion) information have been added successfully' )
            // optional plan
            insuredOptionalPlanInfo(applicationID, insuredPersonID, person[i].selectedPlan.compnayName, person[i], optionalPlanPrice, data.userID)
            // medical question and answer
            insuredMedicalAnswerInfo(applicationID, insuredPersonID, person[i].selectedPlan.medicalQuestion)

          } 
          else {
            reject({status: 409, message: 'error'})
          }
      
        } //for

        resolve({status: 200, message: 'success' })
  
      } catch (err) {
        // console.log('Handling insuredPlanInfo is fail  : ', err )
        reject(err.message)
        }
  })
}

// crud decision for insured option plan data
function insuredOptionalPlanInfo (applicationID, insuredPersonID, selecteCompanyName, person, optionalPlanPrice, userID) {
  return new Promise(async (resolve, reject) => {
    try{
        // console.log('travel_application.js function: insuredOptionalPlanInfo ') 

        let searchSql = `select * from insured_plan_option 
                          where application_id = '${applicationID}' 
                          and insured_person_id = '${insuredPersonID}' `
        const searchResult = await pool.query(searchSql)
        if (searchResult.rowCount !== 0){
          
          if (optionalPlanPrice === 0){
              // if not selected optionalPlan, delete all previous optional plan
              const deleteSql = `delete from insured_plan_option 
                            where application_id = '${applicationID}' 
                              and insured_person_id = '${insuredPersonID}' `
              await pool.query(deleteSql)

          }else{
                // check previous optional plan id 
                // if not selected optionalPlan id, delete previous optional plan id 
                const currntData = person.optionalAddOnPlans
                                    ? person.optionalAddOnPlans.filter(f=>f.compnayName === selecteCompanyName)
                                          .map(i=>i.planTypes.filter(ft=>ft.isSelected === true)
                                                              .map(t=>t.planId))[0]
                                    : []; 
                if (currntData.length > 0){
                    const deleteSql = `delete from insured_plan_option 
                                  where application_id = '${applicationID}' 
                                    and insured_person_id = '${insuredPersonID}' 
                                    and insurance_plan_id not in (${currntData.map(i => `'${i}'`).join()})`
                    await pool.query(deleteSql)               
                }  
          }

        }

        for (const i in person.optionalAddOnPlans) { 
          if (person.optionalAddOnPlans[i].compnayName === selecteCompanyName){
              for ( const planIdx in person.optionalAddOnPlans[i].planTypes){
                if (person.optionalAddOnPlans[i].planTypes[planIdx].isSelected === true){
                  let optionPlanPrice = Math.round(((person.optionalAddOnPlans[i].planTypes[planIdx].calculatedAddOnAmount ? person.optionalAddOnPlans[i].planTypes[planIdx].calculatedAddOnAmount : 0)) * 100) / 100

                  // check existing data 
                  const searchSql = `select * 
                                    from insured_plan_option 
                                    where application_id = '${applicationID}' 
                                      and insured_person_id = '${insuredPersonID}'
                                      and insurance_plan_id = '${person.optionalAddOnPlans[i].planTypes[planIdx].planId}' `
                  const existingData = await pool.query(searchSql)

                  let optionalPlanResult = ''

                  // if data is existed 
                  if (existingData.rowCount === 0){
                    const sql = `insert into insured_plan_option
                                          (application_id, insured_person_id , 
                                            insurance_plan_id , insurance_plan_name, plan_coverage , plan_price, created_by )
                                            values ('${applicationID}', '${insuredPersonID}', 
                                            '${person.optionalAddOnPlans[i].planTypes[planIdx].planId}',
                                            '${person.optionalAddOnPlans[i].planTypes[planIdx].planName}',
                                            ${person.optionalAddOnPlans[i].planTypes[planIdx].selectedCoverage}, 
                                            ${optionPlanPrice}, '${userID}'
                                              ) returning * ` 
                    optionalPlanResult = await pool.query(sql)
                  }
                  // if data is not existed  
                  else if (existingData.rowCount > 0){
                    const sql = `update insured_plan_option
                                    set plan_coverage = $1 ,
                                        plan_price = $2 ,
                                        created_by = $3  
                                  where application_id = '${applicationID}' 
                                    and insured_person_id = '${insuredPersonID}'
                                    and insurance_plan_id = '${person.optionalAddOnPlans[i].planTypes[planIdx].planId}'  returning * ` 
                    const reqData = [person.optionalAddOnPlans[i].planTypes[planIdx].selectedCoverage, optionPlanPrice, userID ]
                    optionalPlanResult = await pool.query(sql, reqData)
                  }  

                  if (optionalPlanResult.rowCount === 0) {
                      reject({status: 409, message: 'error'})
                  }                  

                } // if

            } // for person.optionalAddOnPlans[i].planTypes
          }
        } // for

        resolve({status: 200, message: 'success' })
              
    } catch (err) {
      console.log('Handling insuredOptionalPlanInfo is fail  : ', err )
      reject(err.message)
    }
  })
}


// insured Medical Answer Info
function insuredMedicalAnswerInfo (applicationID, insuredPersonID, medicalAnswer) {
  return new Promise(async (resolve, reject) => {
    try{
        // console.log('travel_application.js function: insuredMedicalAnswerInfo ') 
        // check existing data 
        let searchSql = `select * from insured_medical_answer 
                          where application_id = '${applicationID}' 
                          and insured_person_id = '${insuredPersonID}' `
        const existingData = await pool.query(searchSql)
        if (existingData.rowCount !== 0){
            // delete
            let deleteSql = `delete from insured_medical_answer 
                              where application_id = '${applicationID}' 
                                and insured_person_id = '${insuredPersonID}' returning * `
            const deletedPreviousMedicalAnswer = await pool.query(deleteSql)
            if (deletedPreviousMedicalAnswer.rowCount === 0) {
              reject({status: 409, message: 'error'})
            } 
        }
         // add medical question and answer

         if (medicalAnswer){  //if medicalAnswer
            const question =  medicalAnswer.quesAnswer

            for (const idxMQA in question) { 

            const answer = JSON.stringify(question[idxMQA].answer)

            let header_content_en = null
            if (question[idxMQA].header_content_en){
                header_content_en = `'${question[idxMQA].header_content_en}'`
            }

            let header_content_kr = null
            if (question[idxMQA].header_content_kr){
              header_content_kr = `'${question[idxMQA].header_content_kr}'`
            }

            let sql = `insert into insured_medical_answer ( application_id, insured_person_id, questionnaire_id, 
                          question_code, header_content_en, header_content_kr, content_en, content_kr, input_type, answer )
                        values ('${applicationID}','${insuredPersonID}', '${question[idxMQA].questionnaire_id}',
                    '${question[idxMQA].question_code}', 
                    ${header_content_en}, ${header_content_kr}, 
                    '${question[idxMQA].question_en}', '${question[idxMQA].question_kr}', 
                    '${question[idxMQA].input_type}', '${answer}'
                    ) returning * `

            const medicalAnswerResult = await pool.query(sql)
            if (medicalAnswerResult.rowCount === 0) {
                reject({status: 409, message: 'error'})
            }

          } //for medicalAnswer

        } // end if medicalAnswer

        resolve({status: 200, message: 'success' })
              
    } catch (err) {
      // console.log('Handling insuredMedicalAnswerInfo is fail  : ', err )
      reject(err.message)
    }
  })
}



// payment information
function insuredPaymentInfo (sourceType, applicationID, data, amountPay) {

  return new Promise(async (resolve, reject) => {
    try{
        // console.log('travel_application.js function: insuredPaymentInfo ') 

        // payment
        let payment = {
              payeeId: data.paymentByClient===true?'Client':'',
              amount: amountPay,
              transactionType: 'Purchase',
              transactionDate:  null,
              paymentMethod: data.paymentMethod,
              paymentStatus: 'Pending',
              senderName : data.senderName,
              creditCardType: data.creditCardType,
              cardHolderName: data.cardHolderName,
              creditCardNumber: data.creditCardNumber,
              cardExpired: data.cardExpired,
              cardcvv: data.cardcvv
            }
        // billing address
        let billAddress = {
              addressType: '',
              street: data.billStreetName,
              suiteNo: data.billUnitApartmentNo,
              city: data.billCity,
              province: data.billProvince,
              postalcode: data.billPostalCode,
              country: data.billCountry,
              useType: 'Billing',
              isMailing: false
            };

        const searchSql = `select * from payment where application_id = '${applicationID}' and payment_seq = ${1}`
        const searchResult = await pool.query(searchSql)

        // payment info
        // add
        if (searchResult.rowCount === 0){
          await common.addPaymentInfo(applicationID, payment)
        }
        // udpate
        else{
          await common.updatePaymentInfo(applicationID, payment)
        }

        // billing address info
        // new
        if (searchResult.rowCount === 0){
          if (data.paymentMethod === 'Creditcard'){
            // add billing address
            await common.addAddressInfo(sourceType, applicationID, billAddress)
          }
        }else{
        // update
          const previousPayment = searchResult.rows[0]
          if (previousPayment.payment_method !== data.paymentMethod){
            if (data.paymentMethod === 'Creditcard'){
              // add billing address
              await common.addAddressInfo(sourceType, applicationID, billAddress)
            } else if (previousPayment.payment_method === 'Creditcard'){
              // delete billing address
              await common.deleteAddressInfo(sourceType, applicationID, billAddress.useType)
            }
          } else{
            if (data.paymentMethod === 'Creditcard' || previousPayment.payment_method === 'Creditcard'){
              // update
              await common.updateAddressInfo(sourceType, applicationID, billAddress)
            }
          }
        }

        resolve({status: 200, message: 'success' })

        
  
    } catch (err) {
      console.log('Handling insuredPaymentInfo is fail  : ', err )
      reject(err.message)
      }
  })
}

// application note 
function applicationNoteInfo (applicationID, note, userID) {

  return new Promise(async (resolve, reject) => {
    try{
        // console.log('travel_application.js function: applicationNoteInfo ') 

        // check existing data
        const searchSql = `select * from log_note where application_id = '${applicationID}' and (status = 'Applying' or status = '')`
        const searchData = await pool.query(searchSql)

        let noteResult = ''

        if (searchData.rowCount === 0){
          if (note){
            // insert application log
            let sql = `insert into log_note(application_id , note, status, created_by, updated_by) 
                                    values ('${applicationID}', '${note}', 'Applying', '${userID}', '${userID}'
                                            ) returning * `
            noteResult = await pool.query(sql)
          }
        } // if (existingData.rowCount === 0)
        else{
          if (note){
                //  update application log
                let sql = `update log_note 
                                set note = $1,
                                    updated_by = $2
                              where application_id = '${applicationID}' and (status = 'Applying' or status = '') returning *`
                let reqData = [note, userID]
                noteResult = await pool.query(sql, reqData)
          }else{
                //delete application log
                let sql = `delete from log_note 
                            where application_id = '${applicationID}' and (status = 'Applying' or status = '') returning *`
                noteResult = await pool.query(sql)
          }
        } // searchData

        if (noteResult.rowCount !== 0) {
          resolve({status: 200, message: 'success' })
        }else{
          reject({status: 409, message: 'error'})
        }
  
    } catch (err) {
      console.log('Handling applicationNoteInfo is fail  : ', err )
      reject(err.message)
      }
  })
}


// Update Travel Application
router.put('/update/update_target=:update_target&application_id=:application_id', upload, async(req, res) => {
  try {
    // console.log('travel_applications.js put /update/update_target=:update_target&application_id=:application_id')
      const data = req.body
      data.updateTarget = req.params.update_target

      const person =  data.contactPersons

    // update target data
        var sql = null
        var reqData = []
        if (req.params.update_target === 'upload'){
          // upload policy documents to AWS S3 
          if (req.files.UploadFiles){
            await sendToS3.uploadToS3('Policy',req.files.UploadFiles,'')
            res.send({status: 200, message: 'success', row: req.params.application_id})
          } // upload policy documents to AWS S3  ... end
          
        } else{

          if (data.sourceFrom !== 'Z'){
            // souce from stonewell web            
            if (req.params.update_target === 'contact'){
                // update contact information
                sql = `update application 
                          set phone = $1,
                              email = $2,
                              is_canada_phone = $3
                        where application_id = '${req.params.application_id}' returning *`
                reqData = [data.contactPhone, data.contactEmail, data.phoneInCanada]
            } else if (req.params.update_target === 'address'){
                //update maillingInCanada
                var sql_app = `update application 
                                  set mailling_in = $1
                                where application_id = '${req.params.application_id}' returning *`

                const updateResult = pool.query(sql_app, [data.maillingInCanada])
                if (updateResult.rowCount !== 0) {
                    // update address
                    sql = `update address 
                          set street = $1,
                              suite_no = $2, 
                              city = $3, 
                              province = $4,
                              postalcode = $5
                        where source_type = '${'Travel'}'
                          and source_id = '${req.params.application_id}'
                          and use_type = '${'Mailling'}' returning *`
                    reqData = [data.mailStreetName, data.mailUnitApartmentNo, data.mailCity, data.mailProvince, data.mailPostalCode ]
                }

            } else if (req.params.update_target === 'language'){
              // update prefer_language
              sql = `update application 
                        set prefer_language = $1
                      where application_id = '${req.params.application_id}' returning *`
              reqData = [data.preferLanguage]
            }

            await pool.query(sql, reqData)

          }else{
            // souce from Zoho CRM
            if (req.params.update_target === 'contact'){
              for (const i in person) { 
                  sql_zoho = `update zoho_sales_orders
                                set phone = $1,
                                    email = $2
                              where application_date = '${data.applicationDate}'
                                and firstname = '${person[i].firstName}'
                                and lastname = '${person[i].lastName}'
                                and birthdate = '${person[i].birthdate}'`
                  reqData = [data.contactPhone, data.contactEmail]
                  await pool.query(sql_zoho, reqData)
              }
    
            } else if (req.params.update_target === 'address'){
              for (const i in person) { 
                  sql_zoho = `update zoho_sales_orders
                                set street = $1,
                                    city = $2, 
                                    province = $3,
                                    postalcode = $4
                              where application_date = '${data.applicationDate}'
                                and firstname = '${person[i].firstName}'
                                and lastname = '${person[i].lastName}'
                                and birthdate = '${person[i].birthdate}'`
                  reqData = [data.mailStreetName, data.mailCity, data.mailProvince, data.mailPostalCode ]
                  await pool.query(sql_zoho, reqData)
              }
    
            }
          }

          // send updated notice email to sales@
          let mailOptions = await applicationUpdatedNotice.letterMailOptions(data)
          await mailer.sendEmail(mailOptions)
          // update contact / address to Zoho CRM
          // get token to access Zoho CRM
          const accessZcrm = await zcrmAPI.accessZoho()
          for (const i in person) { 
            // check existed records
            const searchContactsRes =  await zcrmAPI.searchRecord({
                                token : accessZcrm.token,
                                url : 'https://www.zohoapis.com/crm/v2/Contacts/search',
                                parameters: {
                                  'criteria': `((First_Name:equals:${person[i].firstName}) and (Last_Name:equals:${person[i].lastName}) and (Date_of_Birth:equals:${person[i].birthdate}))`,
                                }
                              })
            // update Zoho CRM
            if (searchContactsRes.id){
                await zcrmAPI.updateContactAddressToZoho(accessZcrm.token, data, searchContactsRes.id)
            }
          } // end for 

          res.send({status: 200, message: 'success', row: req.params.application_id})
        }

  } catch (err) {
    console.log('Error  : ', err.message )
    res.send({status: 400, message: err.message, row:[]})
  }
})


// Update payment by client
router.put('/update/direct-payment/confirmation_no=:confirmation_no', async(req, res) => {
  try {
        // console.log('travel_applications.js put /update/direct-payment/confirmation_no=:confirmation_no')
        // check existed data
        const seqrchSql = `select * from application a 
                            join payment p on p.application_id = a.application_id and p.amount = a.total_amount and p.payment_method = 'Creditcard'
                            where confirmation_no = '${req.params.confirmation_no}'
                            and total_amount =  ${req.body.paymentAmount}`

        const resSearch =  await pool.query(seqrchSql)
        if (resSearch.rowCount>0){
            if(resSearch.rows[0].app_status === 'Approved'){
              // 
              res.send({status: 'warning', message: ['Your insurance was already purchased.'], warningCode:'W'})
            }else{
              // update payment by client
              const updateSql = `update payment 
                      set creditcard_type = $1, 
                          creditcard_number = $2, 
                          card_holder = $3, 
                          card_cvv = $4, 
                          card_expired = $5,
                          payee_id = $6
                    where application_id = '${resSearch.rows[0].application_id}'
                      and payment_seq = 1 returning *`
                
              const reqUpdateData = [req.body.creditCardType, req.body.creditCardNumber.replace(/\s+/g, ''), 
                                      req.body.cardHolderName, req.body.cardcvv, req.body.cardExpired, 'Client'
                                    ]
              const resUpdatePayment = await pool.query(updateSql, reqUpdateData)
                  if (resUpdatePayment.rowCount > 0) {
                    res.send({status: 'success', message: 'The update has been completed successfully.'})
                    // get data
                    const collectData = await common.getData(applicationGetSql(resSearch.rows[0].application_id))
                    // send confirmation email
                    await common.sendConfirmEmail('Payment', collectData.data)
                  }else{
                    res.send({status: 'warning', message: ['Something went wrong. Please try again later or contact us'], warningCode:'W'})
                }
            }

        }else{
          res.send({status: 'warning', message: ['We can not found your application. Please check your application and try again or contact us'], warningCode:'W'})
        }
  } catch (err) {
    console.log('Error  : ', err.message )
    res.send({status: 'error', message: ['Something went wrong. Please try again later or contact us'], warningCode:'W'})
  }
})




// sell policy through Tugo APIs
router.put('/sell/policies/application_id=:application_id', async(req, res) => {
  try {
        // console.log('travel_applications.js put /sell/policies/application_id=:application_id')
        // console.log('req.params.application_id',req.params.application_id)
        var apiResult = [];

        // if app_status is 'Pending'
        var tugoApplications = req.body
        if (tugoApplications.application_id && tugoApplications.app_status==='Pending'){

          // access Tugo
          const accessTugo = await tugoAPI.accessTugo()
          const token = accessTugo.token
          // const token = 'n7sbtnrprgmvy3h9fjbk37vd'
          // console.log('token',token)
          
          // Tugo
          tugoInsured = tugoApplications.insuredpersons.filter(f=>f.compnayName === 'Tugo')
          // if tugoInsured is existed, call tugo api
          if (tugoInsured.length>0){
              // address
              var contacts = {
                phoneNumbers : tugoApplications.phone.replace(/[+()-]/g,'').split(" ")[0] === '1' 
                                ? tugoApplications.phone.replace(/\s/g,'').replace(/[+()-]/g,'').slice(-10)
                                : '4166453858',
                mailAddress : tugoApplications.address.filter(f=>f.useType==='Mailling').length>0
                              ? tugoApplications.address.filter(f=>f.useType==='Mailling')
                                                        .map(a=>({"type":"MAIL",
                                                                  "addressLine1": `${a.street}  ${a.suiteNo}`,
                                                                  "city":a.city,
                                                                  "country": 'CA',
                                                                  "province": (a.province.length > 2 
                                                                                ? provinces.find(f=>f.province_name.replace(/\s/g,'').toUpperCase() === a.province.replace(/\s/g,'').toUpperCase()).province_code
                                                                                : a.province),
                                                                  "postalCode": a.postalcode}
                                                        ))
                              :[],
                email : tugoApplications.email
              }
 
              // payment
              var applicationPayment = tugoApplications.payment[0]
              var payment = [];
              const cardExpired  = applicationPayment.cardExpired.split('/')
              if (applicationPayment.paymentMethod==='Creditcard'){
                  payment.push({
                    transactionType:"PURCHASE",
                    paymentType: applicationPayment.paymentMethod.toUpperCase(),
                    paymentMethod:"SINGLE",
                    currencyCode:"CAD",
                    amount: 0,
                    creditCardNumber:applicationPayment.creditCardNumber,
                    creditCardType: applicationPayment.creditCardType.toUpperCase(), 
                    cardHolder: applicationPayment.cardHolderName, 
                    cardExpirationDate: `20${cardExpired[1]}-${cardExpired[0]}`,
                    cardCVV:applicationPayment.cardcvv
                  })
              }else{
                payment.push({
                  transactionType:"PURCHASE",
                  paymentType:"CASH",
                  paymentMethod:"SINGLE",
                  currencyCode:"CAD",
                  amount: 0
                })
              };

              // Group by trip_type, trip_period
              const insured = tugoApplications.insuredpersons.map(i => ({
                eligilbeIns : i.eligilbeIns,
                tripStartDate : i.tripStartDate,
                tripEndDate : i.tripEndDate,
                arrivalDate : i.arrivalDate,
                originProvince : i.originProvince
              }));
              const groupBy = common.groupBykeys(insured,['eligilbeIns','tripStartDate','tripEndDate','arrivalDate', 'originProvince'],[]);

              for (const g in groupBy) {
                  // insuredpersons Group By
                  const insuredGroup = tugoInsured.filter(f=>f.eligilbeIns === groupBy[g].eligilbeIns 
                                                              && f.tripStartDate === groupBy[g].tripStartDate 
                                                              && f.tripEndDate === groupBy[g].tripEndDate 
                                                              && f.arrivalDate === groupBy[g].arrivalDate 
                                                              && f.originProvince === groupBy[g].originProvince )

                  // payment - set amount by groupBy 
                  // payment[0].amount = insuredGroup.reduce((a, v) => a = a + parseFloat(v.insuranceAmount + v.optionPlanPrice), 0);
                  payment[0].amount = insuredGroup.reduce((a, v) => a + parseFloat(v.insuranceAmount + v.optionPlanPrice), 0).toFixed(2);

                  // Sell Policy
                  const sellPoliciesRes = await tugoAPI.sellPolicies(token, insuredGroup, contacts, payment)
                  apiResult.push(sellPoliciesRes.response)

                  if (sellPoliciesRes.response.status === 'success'){
                    // when selling policy is sucess, update policy number 
                    const policyNumber = sellPoliciesRes.response.result.policyInfo?sellPoliciesRes.response.result.policyInfo.policyNumber.referenceNumber:'';
                    // console.log('policyNumber',policyNumber)
                    if (policyNumber){
                      for (const person in insuredGroup) {
                        // update policy number
                        // call updatePolicyNo(application_id, insuredPersonID, policyNo, optionPlanPolicyNo, carewellPolicyNo)
                        await updatePolicyNo(req.params.application_id, insuredGroup[person].insuredPersonID, policyNumber, null, null)
                        // upload S3
                      }
                    }
                  }else{
                    // get a quote & check premium 
                    const getQuoteRes = await tugoAPI.getQuotes(token, insuredGroup)
                    apiResult.push(getQuoteRes.response)
                    // console.log('getQuotes',apiResult)
                  }

                  // Api Test to see if getting a quote
                  // const getQuoteRes = await tugoAPI.getQuotes(token, insuredGroup)
                  // apiResult.push(getQuoteRes.response)
                  
              }
          }
        }
        
        res.send(apiResult)

  } catch (err) {
    console.log('Error  : ', err.message )
    res.send({status: 'error', message: 'Something went wrong!'})
  }
})

// sell Carewell through carewell zoho crm APIs
router.put('/sell/carewell/application_id=:application_id', async(req, res) => {
  try {

        const application = req.body
        const person = application.insuredpersons
        // const person = JSON.parse(application.insuredpersons)
         // get token to access Carewell Zoho CRM
         const accessCarewellzcrm = await carewellzcrmAPI.accessZoho()
        
         for (const i in person) { 
           // check existed records
           const searchContactsRes =  await carewellzcrmAPI.searchRecord({
                               token : accessCarewellzcrm.token,
                               url : 'https://www.zohoapis.com/crm/v2/Contacts/search',
                               parameters: {
                                 'criteria': `((First_Name:equals:${person[i].firstName}) and (Last_Name:equals:${person[i].lastName}) and (Date_of_Birth:equals:${person[i].birthdate}))`,
                               }
                             })
           // update Zoho CRM

           if (searchContactsRes.id){
               await zcrmAPI.updateContactAddressToZoho(accessCarewellzcrm.token, application, searchContactsRes.id)
           }
         } // end for 

         // start Carewell Zoho CRM process
         for (const i in person) { 
          //  if (!person[i].carewellPolicyNo){
             const responseUpdatePolicyNo = await updatePolicyNo(req.params.application_id, person[i].insuredPersonID, person[i].policyNo, person[i].optionPlanPolicyNo, person[i].carewellPolicyNo)
             if (responseUpdatePolicyNo.status === 200){
                 // transfer data to zoho  
                 // set companions as null
                 person[i].companion1 = null
                 person[i].companion2 = null
                 person[i].companion3 = null
                 person[i].companion4 = null
                 person[i].companion5 = null    
                 // 1.먼저 데이타가 생성되었는지 확인 (contact / sales orders)
                 // check existed records

                     const optionPlanLength = person[i].optionPlan.length
                     let optionPlanPremium = null 
                     if (optionPlanLength > 0){
                       optionPlanPremium = person[i].optionPlan.reduce((accu, item) => {
                                                                     return accu + Number(item.optionPlanPrice);
                                                                   }, 0) 
                     } 

                     const searchContactsRes =  await carewellzcrmAPI.searchRecord({
                                                                   token : accessCarewellzcrm.token,
                                                                   url : 'https://www.zohoapis.com/crm/v2/Contacts/search',
                                                                   parameters: {
                                                                     'criteria': `((First_Name:equals:${person[i].firstName}) and (Last_Name:equals:${person[i].lastName}) and (Date_of_Birth:equals:${person[i].birthdate}))`,
                                                                   }
                                                                 })
                     if (searchContactsRes.id){
                        //  console.log(searchContactsRes.id)
                         console.log(' contact 있으면 check existed sales order')
                       //1 contact 있으면 check existed sales order
                         person[i].zohoContactId = searchContactsRes.id
                         const searchSalesRes =  await carewellzcrmAPI.searchRecord({
                                                                   token : accessCarewellzcrm.token,
                                                                   url : 'https://www.zohoapis.com/crm/v2/Sales_Orders/search',
                                                                   parameters: {
                                                                    //  'criteria': `((Contact_Name.id:equals:${searchContactsRes.id}) and (Subject:equals:${person[i].policyNo}))`
                                                                     'criteria': `((Contact_Name.id:equals:${searchContactsRes.id}))`

                                                                   }
                                                                 })  
                                                               
                       if (searchSalesRes.id){
                           console.log(' Sales orders is already existed')
                       } else{
                         // 1.2 Excute transfer
                         // 1.2.1 update contacts
                         const updateContactZohoRes = await carewellzcrmAPI.updateContactToZoho(accessCarewellzcrm.token, application, person[i], searchContactsRes.id, optionPlanLength, optionPlanPremium)
                        //  console.log(updateContactZohoRes)

                         // 1.2.2 insert sales orders
                         if (updateContactZohoRes.status === 200){
                             console.log('will insert contacts')
                             console.log('searchContactsRes.id',searchContactsRes.id)
                             await carewellzcrmAPI.insertSalesToZoho(accessCarewellzcrm.token, application, person[i], searchContactsRes.id, optionPlanLength, optionPlanPremium)
                            //  console.log('result of insertSalesZoho', insertSalesZohoRes.status)
                         }
                       }

                     } else{
                       console.log('contacts 정보가 없으면 contact sales orders 생성')
                       const insertContactsZohoRes = await carewellzcrmAPI.insertContactToZoho(accessCarewellzcrm.token, application, person[i], optionPlanLength, optionPlanPremium)
                       person[i].zohoContactId = insertContactsZohoRes.id
                       console.log('insertContactsZohoRes.id', insertContactsZohoRes.id)
                       console.log('insertContactsZohoRes.status',insertContactsZohoRes.status)
                       if (insertContactsZohoRes.status === 200){
                           await carewellzcrmAPI.insertSalesToZoho(accessCarewellzcrm.token, application, person[i], insertContactsZohoRes.id, optionPlanLength, optionPlanPremium)
                          //  console.log('result of insertSalesZoho', insertSalesZohoRes.status)
                       //2.3 update contact - companions
                       }  
                     }

                 
             }  //if (responseUpdatePolicyNo.status === 200) ... end
     
          //  }  // if person[i].policyNo ... end
         }

         // update companions (link companions ) to zoho 
         if (await person.length > 1){
             // link compaions and than update contacts to zoho
             for (const index in person) {
                 // link compaion id
                 person.filter(f=>f.firstName!==person[index].firstName)
                       .map((p, cIndex)=>{
                               if(cIndex===0){
                                 person[index].companion1 = p.zohoContactId                   
                               }else if(cIndex===1){
                                 person[index].companion2 = p.zohoContactId
                               }else if(cIndex===2){
                                 person[index].companion3 = p.zohoContactId
                               }else if(cIndex===3){
                                 person[index].companion4 = p.zohoContactId
                               }else if(cIndex===4){
                                 person[index].companion5 = p.zohoContactId
                               }
                             })

                 // update Contact's companions
                 if(person[index].zohoContactId){
                   await carewellzcrmAPI.updateContactCompanionsToZoho(accessCarewellzcrm.token, person[index], person[index].zohoContactId)  
                 }  
             };
             

         } //  update compaions (link compaions ) to carewell zoho ... end
         res.send({status: 'success', message: 'Sell', row: []})         
         // carewell zoho crm process ... end 
  } catch (err) {
    console.log('Error  : ', err.message )
    res.send({status: 'error', message: 'Something went wrong!'})
  }
})


// Update new Travel Application
router.put('/update_hold/process/application_id=:application_id', upload, async(req, res) => {
  try {
        console.log('travel_applications.js put /update/application_id=:application_id')
        console.log('testing..')

        console.log('req.params.application_id',req.params.application_id)
        
        const application = req.body

        console.log('application.app_status',application.app_status)
        console.log('application.remark',application.remark)
        // console.log('application.email',application.email)
        // console.log('application.vendor_email',application.vendor_email)
        // const responseUpdateProcess = await updateProcess(req.params.application_id, req.body.app_status)
        // // const person = application.insuredpersons
        // const person = JSON.parse(application.insuredpersons)
        // // add log note
        // if (application.remark){
        //     let sql = `insert into log_note(application_id , note, status, created_by, updated_by) 
        //                                 values ('${req.params.application_id}', '${application.remark}', '${application.app_status}', '${application.userID}', '${application.userID}'
        //                                         ) returning * `
        //     await pool.query(sql)
        // }

        // if (responseUpdateProcess.status === 200 && req.body.app_status === 'Approved' ){

        //     // get data
        //     const collectData = await common.getData(applicationGetSql(req.params.application_id))
        //     // send approved notice email to vendor
        //     collectData.data.remark = application.remark?application.remark:''
        //     await common.sendConfirmEmail('Approved', collectData.data)
          
        // } else  if (responseUpdateProcess.status === 200 && req.body.app_status === 'Void' ){
        //       const data = { 
        //         application_id : req.params.application_id,
        //         email : application.email, 
        //         contactName : application.contact_name,
        //         vendor_email : application.vendor_email, 
        //         remark: application.remark,
        //         person: person
        //       }
        //       // send returned notice email to application creator
        //       let mailOptions = await applicationVoidNotice.letterMailOptions(data)
        //       await mailer.sendEmail(mailOptions)
        // } //if (responseUpdateProcess.status === 200 && req.body.app_status === 'Void') ... end


        
        res.send({status: 'success', message: 'The update has been completed successfully.', row: []})

  } catch (err) {
    console.log('Error  : ', err.message )
    res.send({status: 'error', message: 'Something went wrong!', row:[]})
  }
})

// when application process update 
router.put('/update/process/application_id=:application_id', upload, async(req, res) => {
  try {
        // console.log('travel_applications.js put /update/application_id=:application_id')
        const application = req.body

        // update status
        const responseUpdateProcess = await updateProcess(req.params.application_id, req.body.app_status)
        if (responseUpdateProcess.status === 200){

            // add log_note if remark(note) is existed
            if (application.remark){
              let sql = `insert into log_note(application_id , note, status, created_by, updated_by) 
                                          values ('${req.params.application_id}', '${application.remark}', '${application.app_status}', '${application.userID}', '${application.userID}'
                                                  ) returning * `
              await pool.query(sql)
            }

            // const person = application.insuredpersons
            const person = JSON.parse(application.insuredpersons)

            if (req.body.app_status === 'Approved'){
              // get token to access Zoho CRM
              const accessZcrm = await zcrmAPI.accessZoho()

              // family discount
              application.familyDiscountPerPerson = 0
              if (application.insured_group_type==='Family' && application.family_plan_discount !== 0){
                  application.familyDiscountPerPerson = application.family_plan_discount/application.insured_person_num
              }

              // update policy #
              for (const i in person) { 
                if (person[i].policyNo){
                  const responseUpdatePolicyNo = await updatePolicyNo(req.params.application_id, person[i].insuredPersonID, person[i].policyNo, person[i].optionPlanPolicyNo, person[i].carewellPolicyNo)
                  if (responseUpdatePolicyNo.status === 200){
                      // transfer data to zoho  
                      // set companions as null
                      person[i].companion1 = null
                      person[i].companion2 = null
                      person[i].companion3 = null
                      person[i].companion4 = null
                      person[i].companion5 = null    

                      const optionPlanLength = person[i].optionPlan.length
                      let optionPlanPremium = null 
                      if (optionPlanLength > 0){
                        optionPlanPremium = person[i].optionPlan.reduce((accu, item) => {
                                                                      return accu + Number(item.optionPlanPrice);
                                                                    }, 0) 
                      } 
                      
                      // 1.먼저 데이타가 생성되었는지 확인 (contact / sales orders)
                      // check existed records
                          const searchContactsRes =  await zcrmAPI.searchRecord({
                                                                        token : accessZcrm.token,
                                                                        url : 'https://www.zohoapis.com/crm/v2/Contacts/search',
                                                                        parameters: {
                                                                          'criteria': `((First_Name:equals:${person[i].firstName}) and (Last_Name:equals:${person[i].lastName}) and (Date_of_Birth:equals:${person[i].birthdate}))`,
                                                                        }
                                                                      })

                          if (searchContactsRes.id){
                              // 1 contact 있으면
                              person[i].zohoContactId = searchContactsRes.id                                                                    
                              // 1.1 update contacts
                              const updateContactZohoRes = await zcrmAPI.updateContactToZoho(accessZcrm.token, application, person[i], searchContactsRes.id, optionPlanLength, optionPlanPremium)
                              // console.log(updateContactZohoRes.status)
                              if (updateContactZohoRes.status === 200){
                                  //1.2 check existed sales order                                  
                                  const searchSalesRes =  await zcrmAPI.searchRecord({
                                    token : accessZcrm.token,
                                    url : 'https://www.zohoapis.com/crm/v2/Sales_Orders/search',
                                    parameters: {
                                      'criteria': `((Contact_Name.id:equals:${searchContactsRes.id}) and (Effective_Date:equals:${person[i].tripStartDate}) and (Subject:equals:${person[i].policyNo}))`
                                    }
                                  })
                                  // 1.2.1 update sales order if existed sales order
                                  if (searchSalesRes.id){
                                      // console.log(' Sales orders is already existed, will be updated')
                                      await zcrmAPI.updateSalesToZoho(accessZcrm.token, application, person[i], searchSalesRes.id, searchContactsRes.id, optionPlanLength, optionPlanPremium)
                                  } else{
                                        // 1.2.2 insert sales orders if not existed sales order
                                        // console.log('will insert sales order')
                                        await zcrmAPI.insertSalesToZoho(accessZcrm.token, application, person[i], searchContactsRes.id, optionPlanLength, optionPlanPremium)
                                        // console.log('result of insertSalesZoho', insertSalesZohoRes.status)
                                    // }
                                  }
                              }

                          } else{
                            // console.log('contacts 정보가 없으면 contact sales orders 생성')
                            const insertContactsZohoRes = await zcrmAPI.insertContactToZoho(accessZcrm.token, application, person[i], optionPlanLength, optionPlanPremium)
                            person[i].zohoContactId = insertContactsZohoRes.id
                            // console.log('insertContactsZohoRes.id', insertContactsZohoRes.id)
                            // console.log('insertContactsZohoRes.status',insertContactsZohoRes.status)
                            if (insertContactsZohoRes.status === 200){
                                await zcrmAPI.insertSalesToZoho(accessZcrm.token, application, person[i], insertContactsZohoRes.id, optionPlanLength, optionPlanPremium)
                                // console.log('result of insertSalesZoho', insertSalesZohoRes.status)
                            //2.3 update contact - companions
                            }  
                          }

                      
                  }  //if (responseUpdatePolicyNo.status === 200) ... end
          
                }  // if person[i].policyNo ... end
              }

              // update companions (link companions ) to zoho 
              if (await person.length > 1){
                  // link compaions and than update contacts to zoho
                  for (const index in person) {
                      // link compaion id
                      person.filter(f=>f.firstName!==person[index].firstName)
                            .map((p, cIndex)=>{
                                    if(cIndex===0){
                                      person[index].companion1 = p.zohoContactId                   
                                    }else if(cIndex===1){
                                      person[index].companion2 = p.zohoContactId
                                    }else if(cIndex===2){
                                      person[index].companion3 = p.zohoContactId
                                    }else if(cIndex===3){
                                      person[index].companion4 = p.zohoContactId
                                    }else if(cIndex===4){
                                      person[index].companion5 = p.zohoContactId
                                    }
                                  })

                      // update Contact's companions
                      if(person[index].zohoContactId){
                        await zcrmAPI.updateContactCompanionsToZoho(accessZcrm.token, person[index], person[index].zohoContactId)  
                      }  
                  };

              } //  update compaions (link compaions ) to zoho ... end

          
             
              
              // upload policy documents to AWS S3 
              if (req.files.UploadFiles){
                await sendToS3.uploadToS3('Policy',req.files.UploadFiles,'')
              } // upload policy documents to AWS S3  ... end

              // send email to vendor if approved
              // get data
              const collectData = await common.getData(applicationGetSql(req.params.application_id))
              // send approved notice email to vendor
              collectData.data.remark = application.remark?application.remark:'';
              collectData.data.sendEmailToVendor = true;
              await common.sendConfirmEmail('Approved', collectData.data)
            } //if (req.body.app_status === 'Approved') ... end

            // send email to vendor user when update status as Draft if created by vendor user
            else if (req.body.app_status === 'Draft' && application.source_from === 'V'){

                  // get sendor email 
                  var sql = `select acc.firstname, acc.lastname, acc.email 
                              from application app 
                              join account acc on acc.user_id = app.created_by
                              where app.application_id = '${req.params.application_id}'
                              and source_from = 'V'`
                  const response = await pool.query(sql)
                  if (response.rows && response.rows.length > 0 ){
                      const data = { 
                        application_id : req.params.application_id,
                        creatorEmail : response.rows[0].email, 
                        creatorFullName: `${response.rows[0].firstname} ${response.rows[0].lastname}`,
                        remark: application.remark 
                      }
                      // send returned notice email to application creator
                      let mailOptions = await applicationReturnedNotice.letterMailOptions(data)
                      await mailer.sendEmail(mailOptions)
                  }
                
            } //if (req.body.app_status === 'Draft' && application.source_from === 'V') ... end

            // send email to insured contact person and vendor when update status as Void
            else  if (req.body.app_status === 'Void' ){
                      const data = { 
                        application_id : req.params.application_id,
                        email : application.email, 
                        contactName : application.contact_name,
                        vendor_email : application.vendor_email, 
                        remark: application.remark,
                        person: person
                      }
                      // send email to insured contact person and vendor
                      let mailOptions = await applicationVoidNotice.letterMailOptions(data)
                      await mailer.sendEmail(mailOptions)
            } //if (req.body.app_status === 'Void') ... end
        } //if (responseUpdateProcess.status === 200)
        res.send({status: 'success', message: 'The update has been completed successfully.', row: []})

  } catch (err) {
    console.log('Error  : ', err.message )
    res.send({status: 'error', message: 'Something went wrong!', row:[]})
  }
})


// update application process status
function updateProcess (application_id, app_status) {

  return new Promise(async (resolve, reject) => {
    try{
        // console.log('travel_applications.js function: updateProcess ') 

        let sql = `update application set app_status = $1
            where application_id = '${application_id}' returning *`
        let reqData = [app_status]
        const result = await pool.query(sql, reqData)
        if (result.rowCount !== 0) {
          // console.log(result.rows[0].application_id + ' process status has been updated' )
          // resolve({status: 200, message: 'success'})
          resolve({status: 200, message: 'success', row: result.rows[0].application_id})
        }else{
          reject(err.message)
        }
    } catch (err) {
      console.log('updating process is fail  : ', err )
      reject(err.message)
      }
  })
}

// update application policy number
function updatePolicyNo (application_id, insuredPersonID, policyNo, optionPlanPolicyNo, carewellPolicyNo) {

  return new Promise(async (resolve, reject) => {
    try{
        // console.log('travel_applications.js function: updatePolicyNo ') 
        let sql = `update insured_plan 
                      set policy_number = $1,
                          option_plan_policy_number = $2, 
                          carewell_policy_number = $3
                    where application_id = '${application_id}' 
                      and insured_person_id = '${insuredPersonID}' returning *`
        let reqData = [policyNo, optionPlanPolicyNo, carewellPolicyNo]
        const result = await pool.query(sql, reqData)
        if (result.rowCount !== 0) {
          // console.log(result.rows[0].insured_person_id + ' policy number has been updated' )
          resolve({status: 200, message: 'success', row: result.rows[0].insured_person_id})
        }else{
          reject(err.message)
        }
    } catch (err) {
      console.log(`${insuredPersonID} updating policy number is fail  : `, err )
      reject(err.message)
    }
  })
}


// get data 
const applicationSqlStatement_zcrm = () => {
    let sql = `select to_char(app.application_date,'YYYY-MM-DD') app_date, 
                      vendor_name ::character varying, 
                      vendor_id,
                      null vendor_email,
                      null zoho_client_id, 
                      null zoho_account_id,
                      null zoho_carewell_account_id,
                      false allow_email_client,
                      null application_id,
                      app.application_date,
                      app.refund_requested_num,
                      (case when app.refund_requested_num > 0 
                        then (case when app.refund_requested_num = app.refunded_num 
                                        then (case when app.refunded_num = app.insured_person_num 
                                                        then (case when app.total_refund_amount > 0 
                                                                        then (case when app.total_amount = app.total_refund_amount then 'Refunded-F' else 'Refunded-P' end)
                                                                        else 'Rejected' end) 
                                                        else 'Refunded-P'end)
                                        else (case when app.refund_requested_num = app.refunded_num then 'Refunded' else 'Refund-Requested' end) end )  
                        else 'Approved' end) ::character varying app_status ,
                      insured_type ::character varying, travel_direction_type ::character varying, app."policy", insured_group_type ::character varying, insured_person_num,
                      insurance_plan_price , medical_charged_price , deduct_amount, insurance_amount, option_plan_price,  carewell_service_price,
                      family_plan_amount , family_plan_discount , insurance_card_fee , total_amount,
                      mailling_in, contact_name , email, phone,  
                      (case when renewed > 0 then true else false end) renewal, 
                      source_from ,  source_chnnel , prefer_language, confirmation_no, true AS is_canada_phone,
                      (select COALESCE(json_agg(
                                        json_build_object(
                                          'renewalInsurance', zso.renewed,
                                          'policyNo', zso.policy,
                                          'insuredPersonID', zso.person_id,
                                          'firstName', zso.firstname, 
                                          'lastName', zso.lastname,
                                          'gender', (select gender from insured_person_zoho ipz where person_id = zso.person_id),
                                          'birthdate', zso.birthdate,
                                          'age', null,
                                          'relationship', null,
                                          'originCountryCode', null,
                                          'originCountry', null,
                                          'originProvince', null,
                                          'originProvinceName', null,
                                          'destCountryCode', null,
                                          'destCountry', null,
                                          'destProvince', null,
                                          'destProvinceName', null,
                                          'arrivalDate', null,
                                          'tripStartDate', zso.effective_date,
                                          'tripEndDate', zso.expiry_date,
                                          'tripPeriod', zso.coverage_days,
                                          'multiTripDays', null,
                                          'travelType',	travel_purpose,
                                          'travelPurposeType', '',                     
                                          'graduatedDate', null,                     
                                          'beneficiaryName', null,
                                          'beneficiaryRelationship', '',
                                          'eligilbeIns', zso.insured_type ,
                                          'eligilbeAgrement', true,
                                          'tripType', zso.trip_type,
                                          'compnayName', zso.insurance_company,
                                          'planId', null,
                                          'planName', zso.product ,
                                          'coverage', zso.benefit_amount,
                                          'deductible', zso.deductible_amount,
                                          'plan_price', zso.premium,
                                          'optionPlanPrice', 0, 
                                          'deductAmount', zso.deductible_amount, 
                                          'insuranceAmount', zso.premium, 
                                          'carewellService', zso.carewell_product, 
                                          'insuranceCardFee', 0, 
                                          'insuranceCardIssue', null, 
                                          'carewellServiceAmount', zso.carewell_service_fee, 
                                          'totalAmount', zso.premium,
                                          'refundRequestDate', ir.request_date,
                                          'refundReason', ir.reason,
                                          'refunded', ir.refunded,
                                          'refundDate', ir.refund_date,
                                          'refundAmount', ir.refund_amount,
                                          'documents', ''   
                                                    )),'[]'::json) insuredPersons
                      from zoho_sales_orders_view zso
                      left join insured_refund ir on ir.application_id = zso.zoho_sales_id
                      where zso.application_date = app.application_date
                      and zso.policy = app.policy
                      ),
                      (select COALESCE(json_agg(
                                      json_build_object(
                                          'addressType', null,
                                          'street', street ,          
                                          'suiteNo', null ,
                                          'city', city,
                                          'province', province,
                                          'postalcode', postalcode,
                                          'country', country,
                                          'useType', 'Mailling',
                                          'isMailing', null
                                        )),'[]'::json) address
                      from (select zso.street, zso.city, zso.province, zso.postalcode, zso.country
                              from zoho_sales_orders_view zso
                              where zso.policy = app.policy
                              group by zso.street, zso.city, zso.province, zso.postalcode, zso.country
                            ) address
                      ),
                      (select COALESCE(json_agg(
                                        json_build_object(
                                          'amount', payment.premium ,
                                          'transactionType', null ,          
                                          'transactionDate', null ,
                                          'paymentMethod', payment.payment_method,
                                          'senderName', null,
                                          'creditCardType', null,
                                          'paymentStatus', null,
                                          'creditCardNumber', null,
                                          'cardHolderName', null,
                                          'cardcvv', null,
                                          'cardExpired', null
                                        )),'[]'::json) payment
                      from (select sum(zso.premium) premium, max(zso.payment_method) payment_method
                            from zoho_sales_orders_view zso
                            where zso.policy = app.policy
                            ) payment
                      ),
                      '[]'::json note,
                      '[]'::json vendor_address,
                      '[]'::json email_history
                      from (select z.application_date, z.insured_type, z.travel_direction_type, z.policy, 'Individual' insured_group_type, count(*) insured_person_num, 
                                    0 insurance_plan_price , 0 medical_charged_price , 0 deduct_amount, sum(z.premium) insurance_amount, 0 option_plan_price, sum(carewell_service_fee) carewell_service_price, 
                                    0 family_plan_amount , 0 family_plan_discount , 0 insurance_card_fee , sum(z.premium) total_amount,  
                                    true mailling_in,
                                    '' contact_name , max(z.email) email, max(z.phone) phone,  
                                    sum(case when z.renewed = true then 1 else 0 end) renewed, 
                                    'Z' source_from ,  '' source_chnnel , '' prefer_language, '' confirmation_no,
                                    sum(case when r.request_date is not null then 1 else 0 end) refund_requested_num,
                                    sum(case when r.refunded is not null then 1 else 0 end) refunded_num,
                                    sum(case when r.refund_amount is not null then r.refund_amount else 0 end) total_refund_amount,
                                    z.vendor_id, z.vendor_name
                              from zoho_sales_orders_view z
                              left join insured_refund r on r.application_id = z.zoho_sales_id
                              group by z.application_date, z.insured_type, z.travel_direction_type, z.policy, z.vendor_id, z.vendor_name
                            ) app `
    return sql
  }  


const applicationSqlStatement = () => {
  let sql = `select to_char(app.application_date,'YYYY-MM-DD') app_date, 
                    v.vendor_name,
                    v.vendor_id,
                    v.email vendor_email,
                    v.vendor_code zoho_client_id, 
                    v.zoho_account_id,
                    v.zoho_carewell_account_id,
                    v.allow_email_client, 
                    app.application_id,
                    app.application_date,
                    r.refund_requested_num,
                    (case when r.refund_requested_num > 0 
                      then (case when r.refund_requested_num = r.refunded_num 
                                      then (case when r.refunded_num = app.insured_person_num 
                                                      then (case when r.total_refund_amount > 0 
                                                                      then (case when app.total_amount = r.total_refund_amount then 'Refunded-F' else 'Refunded-P' end)
                                                                      else 'Rejected' end) 
                                                      else 'Refunded-P'end)
                                      else (case when r.refund_requested_num = r.refunded_num then 'Refunded' else 'Refund-Requested' end) end )  
                      else app.app_status ::character varying end) ::character varying app_status,
                    insured_type::character varying, travel_direction_type ::character varying, '' "policy", insured_group_type ::character varying, insured_person_num,
                    insurance_plan_price , medical_charged_price , deduct_amount, insurance_amount, option_plan_price,  carewell_service_price,
                    family_plan_amount , family_plan_discount , insurance_card_fee , total_amount,
                    app.mailling_in, app.contact_name, app.email, app.phone, renewal , app.source_from , app.source_chnnel, app.prefer_language, app.confirmation_no, app.is_canada_phone,
                    (select  COALESCE(json_agg(
                                        json_build_object(
                                          'renewalInsurance', ip.renewal,
                                          'policyNo', ip.policy_number,
                                          'insuredPersonID', ip.insured_person_id,
                                          'firstName', iperson.firstname, 
                                          'lastName', iperson.lastname,
                                          'gender', iperson.gender,
                                          'birthdate', iperson.birthdate,
                                          'age', ip.age,
                                          'relationship', ip.relationship,
                                          'originCountryCode', ip.origin_country,
                                          'originCountry', (select name from country where country_code = ip.origin_country),
                                          'originProvince', origin_province,
                                          'originProvinceName', (select province_name from province where country_code = 'CA' and province_code = ip.origin_province),
                                          'destCountryCode', ip.destination_country,
                                          'destCountry', (select name from country where country_code = ip.destination_country),
                                          'destProvince', ip.destination_province,
                                          'destProvinceName', (select province_name from province where country_code = 'CA' and province_code = ip.destination_province),
                                          'arrivalDate', ip.arrival_date,
                                          'tripStartDate', ip.effective_date,
                                          'tripEndDate', ip.expiry_date,
                                          'tripPeriod', ip.coverage_days,
                                          'multiTripDays', ip.multi_trip_days,
                                          'travelType', (CASE ip.travel_purpose_type 
                                                                WHEN 'SS' THEN 'Study'
                                                                WHEN 'SF' THEN 'Students Family'
                                                                WHEN 'WW' THEN 'Working'
                                                                WHEN 'TL' THEN 'Travel in leisure'
                                                                WHEN 'SV' THEN 'Applying Super visa'
                                                                WHEN 'PW' THEN 'Applying/Accepted PGWP'
                                                                WHEN 'RH' THEN 'Returning home'
                                                                WHEN 'VC' THEN 'Vacation'
                                                                WHEN 'BT' THEN 'Business Trip'
                                                                WHEN 'SA' THEN 'Study Abroad'
                                                                WHEN 'CV' THEN 'Cruise Vacation'
                                                                WHEN 'SB' THEN 'Snow Bird'
                                                                WHEN 'RT' THEN 'Road Trip'
                                                                WHEN 'GT' THEN 'Golf Trip'
                                                                WHEN 'OT' THEN 'Other'
                                                                ELSE ip.travel_purpose_type END),
                                          'travelPurposeType',travel_purpose_type,                     
                                          'graduatedDate',graduation_date,                     
                                          'beneficiaryName', ip.beneficiary_fullname,
                                          'beneficiaryRelationship', ip.benef_relation,
                                          'eligilbeIns', ip.eligible_insured_type,
                                          'eligilbeAgrement', ip.eligible_status,
                                          'tripType', ip.trip_type,
                                          'compnayName', ip.insurance_compnay_id,
                                          'planId', ip.insurance_plan_id,
                                          'planName', (select generic_name from plan where plan_id = ip.insurance_plan_id),
                                          'coverage', ip.plan_coverage,
                                          'deductible', ip.plan_deduct,
                                          'plan_price', ip.plan_price,
                                          'planMedicalSurcharge', ip.plan_medical_charged_price,
                                          'optionPlan', (select COALESCE(json_agg(
                                                                        json_build_object(
                                                                            'optionPlanId', insurance_plan_id,
                                                                            'optionPlanName', insurance_plan_name,
                                                                            'optionPlanCoverage', plan_coverage,
                                                                            'optionPlanPrice',plan_price
                                                                          )),'[]'::json) optionPlan
                                                          from insured_plan_option
                                                          where application_id = ip.application_id 
                                                          and insured_person_id = ip.insured_person_id 
                                                          ),
                                          'optionPlanPrice', ip.option_plan_price, 
                                          'deductAmount', ip.deduct_amount, 
                                          'insuranceAmount', ip.insurance_amount, 
                                          'carewellService', ip.carewell_service, 
                                          'insuranceCardFee', ip.insurance_card_fee, 
                                          'insuranceCardIssue', ip.insurance_card_issue, 
                                          'insuranceCardDeliveryDate', ip.insurance_card_delivery_date, 
                                          'carewellServiceAmount', ip.carewell_service_price, 
                                          'totalAmount', ip.total_amount,
                                          'chargeRate', ip.charge_rate,
                                          'medicalAnswer', (select COALESCE(json_agg(
                                                                        json_build_object(
                                                                            'questionnaire_id', questionnaire_id,
                                                                            'question_code', question_code,
                                                                            'header_content_en', header_content_en,
                                                                            'header_content_kr', header_content_kr,
                                                                            'question_kr', content_kr,
                                                                            'question_en', content_en,
                                                                            'input_type', input_type,
                                                                            'answer',answer
                                                                          )),'[]'::json) insured_medical_answer
                                                          from insured_medical_answer
                                                          where application_id = ip.application_id 
                                                          and insured_person_id = ip.insured_person_id 
                                                          ),
                                          'documents', (select COALESCE(json_agg(
                                                                        json_build_object(
                                                                            'document_type', document_type ,          
                                                                            'language', language ,
                                                                            'document_url', document_url
                                                                          )),'[]'::json) documents
                                                                          from plan_document
                                                                          where plan_id = ip.insurance_plan_id
                                                                          and document_type in('Brochure','Refund')
                                                                          ) 
                                            )::jsonb
                                        ||
                                        json_build_object(
                                          'refundRequestDate', ir.request_date,
                                          'refundReason', ir.reason,
                                          'refunded', ir.refunded,
                                          'refundDate', ir.refund_date,
                                          'refundAmount', ir.refund_amount,
                                          'optionPlanPolicyNo', ip.option_plan_policy_number,
                                          'carewellPolicyNo', ip.carewell_policy_number
                                            )::jsonb
                                      ),'[]'::json) insuredPersons
                        from insured_plan ip
                        join insured_person iperson  on iperson.person_id =  ip.insured_person_id
                        left join insured_refund ir on ir.application_id = ip.application_id and ir.insured_person_id = ip.insured_person_id
                        where ip.application_id = app.application_id
                        ),
                    (select COALESCE(json_agg(
                                      json_build_object(
                                          'addressType', address_type,
                                          'street', street ,          
                                          'suiteNo', suite_no ,
                                          'city', city,
                                          'province', province,
                                          'postalcode', postalcode,
                                          'country', country,
                                          'useType', use_type,
                                          'isMailing', is_mailing
                                        )),'[]'::json) address
                        from address
                        where source_id = app.application_id
                        ),
                    (select COALESCE(json_agg(
                                      json_build_object(
                                          'amount', amount,
                                          'transactionType', transaction_type ,          
                                          'transactionDate', transaction_date ,
                                          'paymentMethod', payment_method,
                                          'senderName', sender_name,
                                          'PaymentBy', payee_id,
                                          'creditCardType', creditcard_type,
                                          'paymentStatus', payment_status,
                                          'creditCardNumber', creditcard_number,
                                          'cardHolderName', card_holder,
                                          'cardcvv', card_cvv,
                                          'cardExpired', card_expired
                                        )),'[]'::json) payment
                        from payment
                        where application_id = app.application_id
                        ),
                        (select COALESCE(json_agg(
                          json_build_object(
                              'note_seq', note_seq,
                              'status', status,
                              'note', note,
                              'noteDate', to_char(created_at,'YYYY-MM-DD')
                            )),'[]'::json) note
                        from log_note
                        where application_id = app.application_id
                        ),
                        (select COALESCE(json_agg(
                                    json_build_object(
                                        'street', a.street,  
                                        'suiteNo', a.suite_no, 
                                        'city', a.city, 
                                        'province', a.province, 
                                        'postalCode', a.postalcode                                            
                                      )),'[]') vendor_address
                          from address a
                          where a.source_type = 'Vendor' and source_id = app.vendor_id
                        ),
                        (select COALESCE(json_agg(
                                    json_build_object(
                                      'contentType', e.content_type,
                                      'emailedTo', e.email,
                                        'emailedAt', to_char(e.emailed_at,'YYYY-MM-DD'),  
                                        'emailedBy', a.firstname||' '||a.lastname                                            
                                      )),'[]') email_history
                          from email_history e
                          join account a on a.user_id = e.emailed_by
                          where e.source_type = 'Travel' 
                          and e.source_id = app.application_id
                          and e.content_type in('Policy','ApprovedConfirmation')
                        )
                  from application app
                  join vendor v on v.vendor_id = app.vendor_id
                  left join (select ip.application_id,
                                    count(*) "refund_requested_num",  
                                    sum(case when ir.refunded is not null then 1 else 0 end) "refunded_num",
                                    sum(case when ir.refund_amount is not null then ir.refund_amount else 0 end) total_refund_amount
                                from insured_plan ip
                                join insured_refund ir on ir.application_id = ip.application_id and ir.insured_person_id = ip.insured_person_id 
                                where substring(ip.application_id,1,1) = 'A'
                                group by ip.application_id 
                              ) r on r.application_id = app.application_id
                  `
  return sql
}


const applicationGetSql = (id) => {
  let sql = applicationSqlStatement() + ' ' +  
            `where app.application_id = '${id}' `
  return sql

}

// 
const clientApplicationGetSql = (id) => {
  let sql = applicationSqlStatement() + ' ' +  
            `where app.application_id in (${id}) `
  return sql
}

// Renewable application
// Application for renewal: 0 days, 14 days from the expiration date
const renewableApplicationSqlStatement = () => {
  let sql = `select *
              from (select to_char(z.application_date,'YYYY-MM-DD') "application_date", zoho_sales_id application_id, z.travel_direction_type, 
                            z.insurance_company, z.insured_type, upper(z.trip_type) "trip_type", z.benefit_amount "plan_coverage", z.policy "policy_number",
                            '' relationship, z.firstname, z.lastname, ipz.gender, to_char(z.birthdate,'YYYY-MM-DD') "birthdate",  
                            to_char(z.effective_date,'YYYY-MM-DD') "effective_date", to_char(z.expiry_date,'YYYY-MM-DD') "expiry_date",  
                            (z.expiry_date - CURRENT_DATE) remain_days,
                            '' contact_name , z.email, z.phone,
                            z.street, '' suite_no, z.city , z.province , z.postalcode, z.country,
                            'Z' source_from ,  lower(v.prefer_language) "prefer_language",
                            v.vendor_name, v.allow_email_client, 
                            r.request_date
                      from zoho_sales_orders_view z
                      join vendor v on v.vendor_id = z.vendor_id
                      left join insured_refund r on r.application_id = z.zoho_sales_id
                      left join insured_person_zoho ipz on ipz.person_id = z.person_id
                      where z.expiry_date >=  CURRENT_DATE
                        and (z.expiry_date - CURRENT_DATE) in(0,14,30)
                        and z.email is not null
                        and z.insured_type = 'CANADIAN'
                    ) app
                where app.request_date is null
                union all 
                select *
                from (select to_char(a.application_date,'YYYY-MM-DD') "application_date",i.application_id, (a.travel_direction_type::text) travel_direction_type,
                              i.insurance_compnay_id insurance_company, i.eligible_insured_type insured_type,  i.trip_type, i.plan_coverage , i.policy_number,
                              p.relationship, p.firstname, p.lastname, p.gender, to_char(p.birthdate,'YYYY-MM-DD') "birthdate",  
                              to_char(i.effective_date,'YYYY-MM-DD') "effective_date", to_char(i.expiry_date,'YYYY-MM-DD') "expiry_date" , 
                              (i.expiry_date - CURRENT_DATE) remain_days,
                              a.contact_name, a.email, a.phone,
                              address.street, address.suite_no, address.city , address.province , address.postalcode, address.country,
                              a.source_from , a.prefer_language ,
                              v.vendor_name, v.allow_email_client, 
                              r.request_date
                        from insured_plan i 
                        join application a on a.application_id = i.application_id and a.app_status = 'Approved'
                        join address on address.source_type = 'Travel' and address.use_type = 'Mailling' and address.source_id = i.application_id 
                        join insured_person p on p.person_id  = i.insured_person_id 
                        join vendor v on v.vendor_id = a.vendor_id
                        left join insured_refund r on r.application_id = i.application_id and r.insured_person_id  = i.insured_person_id 
                        where i.expiry_date >=  CURRENT_DATE
                          and (i.expiry_date - CURRENT_DATE) in(0,14,30)
                    ) app
                where app.request_date is null
                order by remain_days, email, birthdate
  `
  return sql
}

// Vendor Draft application
// Draft Application for reminder: 1 days from the application date
const draftApplicationSqlStatement = () => {
  let sql = `
              SELECT a.application_id, v.email as vendor_email, v.vendor_name as vendor_name, json_agg(json_build_object('firstName', ipz.firstName, 'lastName', ipz.lastName)) as insuredpersons
              FROM application a
              JOIN insured_plan ip ON ip.application_id = a.application_id
              JOIN insured_person ipz ON ipz.person_id = ip.insured_person_id
              JOIN vendor v ON v.vendor_id = a.vendor_id
              WHERE a.app_status = 'Draft' AND a.application_date = CURRENT_DATE - INTERVAL '1' DAY
              GROUP BY a.application_id, v.email, v.vendor_name;
             `
  return sql
}

module.exports = router
module.exports.applicationGetSql = applicationGetSql;
module.exports.sendExpireNoticEmail = sendExpireNoticEmail;
module.exports.sendDraftReminderEmails = sendDraftReminderEmails;
