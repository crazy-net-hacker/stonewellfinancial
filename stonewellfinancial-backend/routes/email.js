require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')
const common  = require('./common')
const applicationGetSql  = require('./travel_applications').applicationGetSql
const lifeGetSql  = require('./life_quotes').lifeGetSql
const heatlhSql  = require('./health_quotes').healthGetSql
const groupGetSql  = require('./group_quotes').groupGetSql
const refundGetSql  = require('./insured_refunds').refundGetSql
//
const mailer = require('../middlewares/emailService/mailer')
const emailLetterTemplate = require('../middlewares/emailService/templates/emailLetterTemplate')
const verificationLetter = require('../middlewares/emailService/templates/verificationLetter')
const policyDeclaration = require('../middlewares/emailService/templates/policyDeclaration')
//
const testApplicationConfirmation = require('../middlewares/emailService/templates/testApplicationConfirmation')
const applicationApprovedNotice = require('../middlewares/emailService/templates/applicationApprovedNotice')
const InsuranceExpirationNotice = require('../middlewares/emailService/templates/InsuranceExpirationNotice')

// sendemail for testing
router.post('/source=:source&souceId=:souceId', async(req, res) => {
  try {

    // console.log('/source=:source&souceId=:souceId')
    // console.log('souceId=:souceId', req.params.souceId)
  
    let collectData = ''
    // get data
    switch (req.params.source) {
      case 'Travel':
        collectData = await common.getData(applicationGetSql(req.params.souceId)) 
        collectData.data.contact_name = collectData.data.contact_name.replace(/\s/g, "_");
          break;
      case 'Payment':
        collectData = await common.getData(applicationGetSql(req.params.souceId)) 
              break;
      case 'Approved':
        collectData = await common.getData(applicationGetSql(req.params.souceId)) 
              break;
      case 'Life':
        collectData = await common.getData(lifeGetSql(req.params.souceId))         
          break;
      case 'Health':
        collectData = await common.getData(heatlhSql(req.params.souceId))       
          break;
      case 'Group':
        collectData = await common.getData(groupGetSql(req.params.souceId))          
          break;
      case 'Refund':
        collectData = await common.getRefundRequestedData(refundGetSql(req.params.souceId)) 
          break;
      default:
          break
    }

    if (collectData.data){
      // console.log('collectData.data',collectData.data)
      // send confirmation email
      sendingEmailResut = await common.sendConfirmEmail(req.params.source, collectData.data)

      res.status(200).send({
        "status": sendingEmailResut.status,
        "message": sendingEmailResut.message
      })
    } else {
      res.status(404).send({
          "status": '404',
          "message": 'No Data found'
       })
    }

  } catch (err) {
      console.error(err)
      res.send({ err })
  }
})


router.post('/template/email=:email', async(req, res) => {
  try {
  
      let mailOptions = await emailLetterTemplate.letterMailOptions(req.params.email)
      // send email to client 
      await mailer.sendEmail(mailOptions)

      res.status(200).send({
        "status": 200,
        "message": 'sucess'
      })


  } catch (err) {
      console.error(err)
      res.send({ err })
  }
})

router.post('/password/source=:source', async(req, res) => {
  try {
      
      let mailOptions = await verificationLetter.letterMailOptions(source, data)

      // // send email to client 
      await mailer.sendEmail(mailOptions)
        res.status(200).send({
          "status": 200,
          "message": 'sucess'
        })


  } catch (err) {
      console.error(err)
      res.send({ err })
  }
})


// send email to client (insured)
router.post('/send_email', async(req, res) => {
  try {
        // console.log('email.js post /send_email')
        let eTemplate = {};
        var emailTo = ''; 
        var sentEmail = false;

        // policy
        if (req.body.contentType === 'Policy'){
            // set MailOptions
            eTemplate = await getPolicyTemplate(req.body)
            // send email to client 
            if (eTemplate.status === 'success' && eTemplate.mailOptions){
              var sendResult =  await mailer.sendEmail(eTemplate.mailOptions)
              // set sentEmail for insert email history if sent email successfully
              if (sendResult.accepted.length > 0){
                emailTo = req.body.to;
                sentEmail = true;
              } // end if (sendResult.accepted.length)
            } //end if (eTemplate.status === 'success' && eTemplate.mailOptions)
          
        } 
        // Approved Confirmation
        else if (req.body.contentType === 'ApprovedConfirmation'){
          // get data
          const collectData = await common.getData(applicationGetSql(req.body.applicationId))
          // set without send notice email to vendor
          collectData.data.sendEmailToVendor = false;
          // send email
          await common.sendConfirmEmail('Approved',collectData.data)
          // set sentEmail for insert email history if sent email successfully
          emailTo = collectData.data.email
          sentEmail = true;
        }

        //insert email history if sent email successfully
        if (sentEmail === true){
          const insertSql = `insert into email_history(source_type, source_id, content_type, 
                                                        email, emailed_by )
                                                values('${req.body.sourceType}', ${req.body.applicationId?`'${req.body.applicationId}'`:null}, '${req.body.contentType}', 
                                                        '${emailTo}', '${req.body.user}')`
          await pool.query(insertSql)
          res.status(200).json({ "status":"success", "message": `Sent email ${emailTo?`to ${emailTo}`:`${''}`} successfully.`})

        }else{
          res.status(200).json({ "status":"error", "message": eTemplate.message?eTemplate.message:'Something went wrong'})
        }

    } catch (err) {
      // console.error(err.message)
      res.send({
        "status":"error",
        "message": "Something went wrong",
        })
      }
})


// getPolicyEmailTemplate
function getPolicyTemplate(data) {
  return new Promise(async (resolve, reject) => {
    try{
        // console.log('email.js function: getPolicyTemplate ') 

        const attached = data.attachments;
        const attachmentList = []
        
        for (const i in attached) {
          if(attached[i].file.Body){
            attachmentList.push({filename: attached[i].fileName,
                                  content: new Buffer.from(attached[i].file.Body.data),
                                  contentType:  attached[i].file.ContentType
            })
          }
        }
  
        if (attachmentList.length > 0 ){
            // set sendInfo
            const sendInfo = {from: data.from,
                              to: data.to,
                              bcc: data.bcc,
                              mailAttachedFile: attachmentList
            };
            // mailOptions
            let mailOptions = await policyDeclaration.policyToClient(sendInfo)
            resolve({status: 'success', message: 'success', mailOptions: mailOptions })
      } //if attached.length > 0 
      else{
        resolve({status: 'error', message: 'No attached (policies) files', mailOptions: '' })
      }    
    } catch (err) {
        // console.log(' is fail  : ', err.message )
        resolve({status: 'error', message: 'Something went wrong', mailOptions: ''})
      }
  })
}

router.post('/application/payment/applicationId=:applicationId', async(req, res) => {
  try {
      
      let collectData = await common.getData(applicationGetSql(req.params.applicationId)) 

      // console.log('collectData',`${insured.firstName} ${insured.lastName}`  )
      let data = {email: collectData.data.email, PaymentBy : collectData.data.payment[0].PaymentBy, confirmation_no: collectData.data.confirmation_no,  contact_name: collectData.data.contact_name.replace(/\s/g, "_"), total_amount: collectData.data.total_amount, vendor_name: collectData.data.vendor_name}
      // let data = collectData.data
      let mailOptions = await testApplicationConfirmation.letterMailOptions(data)

      // send email to client 
      await mailer.sendEmail(mailOptions)
        res.status(200).send({
          "status": 'sucess',
          "message": 'sucess'
        })


  } catch (err) {
      console.error(err)
      res.send({ err })
  }
})

router.post('/application/notice/applicationId=:applicationId', async(req, res) => {
  try {
      
      let collectData = await common.getData(applicationGetSql(req.params.applicationId)) 

      let mailOptions = await applicationApprovedNotice.letterMailOptions(collectData.data)

      // send email to client 
      await mailer.sendEmail(mailOptions)
        res.status(200).send({
          "status": 'sucess',
          "message": 'sucess'
        })


  } catch (err) {
      console.error(err)
      res.send({ err })
  }
})


router.post('/application/notice/renewable/applicationId=:applicationId', async(req, res) => {
  try {
      // console.log('email.js post /application/notice/renewable/applicationId=:applicationId')
      const sql = `select *
                    from (select to_char(a.application_date,'YYYY-MM-DD') "application_date",i.application_id, (a.travel_direction_type::text) travel_direction_type,
                                  i.insurance_compnay_id insurance_company, i.eligible_insured_type insured_type, i.plan_coverage , i.policy_number,
                                  p.relationship, p.firstname, p.lastname, p.gender, to_char(p.birthdate,'YYYY-MM-DD') "birthdate",  
                                  to_char(i.effective_date,'YYYY-MM-DD') "effective_date", to_char(i.expiry_date,'YYYY-MM-DD') "expiry_date" , 
                                  (i.expiry_date - CURRENT_DATE) remain_days,
                                  a.contact_name, a.email, a.phone,
                                  address.street, address.suite_no, address.city , address.province , address.postalcode, address.country,
                                  a.source_from ,
                                  r.request_date
                            from insured_plan i 
                            join application a on a.application_id = i.application_id and a.application_id = '${req.params.applicationId}'
                            join address on address.source_type = 'Travel' and address.use_type = 'Mailling' and address.source_id = i.application_id 
                            join insured_person p on p.person_id  = i.insured_person_id 
                            left join insured_refund r on r.application_id = i.application_id and r.insured_person_id  = i.insured_person_id 
                --                        where i.expiry_date >  CURRENT_DATE
                --                          and (i.expiry_date - CURRENT_DATE) in(0,14,30)
                        ) app
                    where app.request_date is null
                    order by remain_days, email, birthdate
                    `
      const result = await pool.query(sql)

      if (result.rowCount > 0){

        // group by email, insurance_company, insured_type
        const applications = result.rows.map(i=>({email : i.email,
                                                  insurance_company : i.insurance_company,
                                                  insured_type : i.insured_type,
                                                  persons: i
                                          }))
        const applicationByCompany = common.groupBykeys(applications, ['email','insurance_company', 'insured_type'], ['persons'], 'detail')
        
        // group by email
        const applicationCompanies = applicationByCompany.map(i=>({ email : i.email,
                                                                    renewable_plan: i
                                                          }))
        const applicationByEmail = common.groupBykeys(applicationCompanies, ['email'], ['renewable_plan'], 'detail')

        var SendingEmailCount = 0;
        
        for (i in applicationByEmail){
              SendingEmailCount += 1;
              //sending email
              let mailOptions = await InsuranceExpirationNotice.letterMailOptions(applicationByEmail[i])
              await mailer.sendEmail(mailOptions)     
        }

        return res.status(200).json({
          "status":"success",
          "message": `Sent to ${SendingEmailCount} email successfully`,
        })
        
      } else{
        return res.status(200).json({
          "status":"warning",
          "message": "Not found for sending email renewable applications ",     
        })
      }


  } catch (err) {
      console.error(err)
      res.send({ err })
  }
})

module.exports = router

