require('dotenv')
const express = require('express')
const crypto = require('crypto')
const router = express.Router()
const pool = require('../db')
const common  = require('./common')
const zcrmAPI = require('./zoho_crm_APIs')
// upload file
const multer = require('multer')
const storage = multer.memoryStorage()
// send email
const mailer = require('../middlewares/emailService/mailer')
const requestToProvider = require('../middlewares/emailService/templates/requestToProvider')

const upload = multer({ storage }).fields([
  { name: 'UploadFiles', maxCount: 20 }
])

const sendToS3 = require('../middlewares/awsS3/sendToS3')

// GET refunds by vendor
router.get('/fr=:fr&to=:to&vendor_id=:vendor_id', async(req, res) => {
  try {
    // console.log('insured_refunds.js get /fr=:fr&to=:to&vendor_id=:vendor_id')
    let sql = `select r.refund_id , to_char(r.request_date,'YYYY-MM-DD') "request_date", r.application_id, r.insured_person_id ,
                      r.firstname , r.lastname , to_char(r.birthdate,'YYYY-MM-DD') "birthdate", r.email ,
                      (case when r.insurance_company = 'TuGo' then 'Tugo'
                        when r.insurance_company = 'Blue Cross' then 'BlueCross'
                        else r.insurance_company end) insurance_company,
                      r.insurance_type , r.policy_number ,to_char(r.effective_date,'YYYY-MM-DD') "effective_date",
                      r.documents_url, r.reason , r.email_provider, to_char(r.email_date,'YYYY-MM-DD') "email_date",
                      r.status , r.refunded, to_char(r.refund_date,'YYYY-MM-DD') refund_date , 
                      r.refund_amount , r.admin_fee, r.discounted_amount, r.actual_refund_amount_sent, 
                      r.refund_payment_method, r.etransfer_email, r.etransfer_recipient, to_char(r.etransfer_refund_date,'YYYY-MM-DD') "etransfer_refund_date" ,
                      r.source_from, r.vendor_id , v.vendor_name, r.confirmation_no
                  from  (select * 
                          from insured_refund
                          where vendor_id like '${req.params.vendor_id==='*'?'%':req.params.vendor_id}'
                            and (request_date between '${req.params.fr}' and '${req.params.to}'
                                  or refund_date between '${req.params.fr}' and '${req.params.to}')
                          ) r
                  left join vendor v on v.vendor_id = r.vendor_id
                  order by r.request_date, vendor_id`
    pool.query(sql, function (err, result) {
      if (!err) {
        res.status(200).json({ data: result.rows })
      }
      else{
        res.status(200).json({
          "status": "error",
          "message": "Something went wrong"                
        })
      }
    })

  } catch (err) {
    console.error(err.message)
    res.status(200).json({
      "status": "error",
      "message": "Something went wrong"                
    })
  }
})


// Create new life insurance quote
router.post('/add', upload, async(req, res) => {
  try {
      // console.log('refunds.js post /add')
      // console.log('*** Refund request is submitting... ***')

      const confirmationNo = crypto.createHash('md5').update(new Date().toISOString()).digest('hex').toString().substring(0,10);
      let fileUrl = req.files.UploadFiles ? await sendToS3.uploadToS3('Refund',req.files.UploadFiles, '') : ''
      // console.log('fileUrl',fileUrl)
      // sourceFrom : Vendor
      if (req.body.sourceFrom === 'V'){
          const person = JSON.parse(req.body.insuredPersons)
          // console.log('person',person)
          var targetRefundId = []
          for (const i in person) {
            person[i].email = req.body.email;
            person[i].reason = req.body.reason;
            person[i].sourceFrom = req.body.sourceFrom;
            person[i].userID = req.body.userID;
            const result = await addRefundRequest(person[i], '', confirmationNo)
            if (result && result.status === 'success'){
              // set targetRefundId
              targetRefundId.push(result.refundId)
            }
          } // end for (const i in person)
          // send confirmation email
          if (targetRefundId.length> 0){
            // get data
              const collectData = await common.getRefundRequestedData(refundGetSql(targetRefundId.join('\',\'')))
              // send confirmation email
              await common.sendConfirmEmail('Refund', collectData.data)
          }

          res.status(200).json({
            "status":"success",
            "message": "Refund request have been submitted successfully",
            "data": confirmationNo
            })
      } else {
        // sourceFrom: Public
        const data = req.body
          // add refund requst => single data
          const result = await addRefundRequest(data, fileUrl, confirmationNo)
          res.status(200).json({
            "status": result.status,
            "message": result.message,
            "warningCode": result.warningCode?result.warningCode:null,
            "data": result.confirmationNo
            })
          // send confirmation email
          if (result && result.status === 'success'){
              // get data
              const collectData = await common.getRefundRequestedData(refundGetSql(result.refundId))
              // send confirmation email
              await common.sendConfirmEmail('Refund', collectData.data)
          }
      }
          
    } catch (err) {
    // console.error(err.message)
    res.send({
      "status":"error",
      "message": "Something went wrong",
      })
    }
})

// save Refund Request information 
function addRefundRequest (data, fileUrl, confirmationNo) {

  return new Promise(async (resolve, reject) => {
    try{
        // console.log('refunds.js function: addRefundRequest ') 
        const searchPoliceRes = await searchPolicy(data)
        if (searchPoliceRes.rows.length > 0){
          const policyInfo = searchPoliceRes.rows[0]
          const refundCriteria = {
            policyNum : data.policyNum, 
            effectiveDate: policyInfo.effectiveDate, 
            firstName : data.firstName,
            lastName : data.lastName,
          }
          // if 저장 되어 있는 환불 데이타가 없다면,
          const searchRefundRes = await searchRefundRequested(refundCriteria)
          if (searchRefundRes.rows.length === 0){
              const documentUrl = data.sourceFrom === 'P'?`{${fileUrl}}`:`{${data.requiredFiles}}`
              // insert into
              const sql = `insert into insured_refund 
                                  (source_from, vendor_id, application_id, insured_person_id, firstname, lastname, birthdate, email,
                                          insurance_company , insurance_type, policy_number, effective_date , 
                                          reason, documents_url, email_provider , email_date , 
                                          refunded, refund_date, refund_amount, status, confirmation_no, created_by )
                            values ('${data.sourceFrom}', '${policyInfo.vendorId}', '${policyInfo.applicationId}', '${policyInfo.personId}','${data.firstName}', '${data.lastName}', '${policyInfo.birthdate}', '${data.email}', 
                                    '${data.insuranceCompany}', '${data.insuranceType.toUpperCase()}', '${data.policyNum}', '${policyInfo.effectiveDate}', 
                                    '${data.reason}', '${documentUrl}', false, null, 
                                    null, null, null, 'Requested', '${confirmationNo}', '${data.userID?data.userID:''}') returning * `
              // console.log(sql)
              const addRefundRes = await pool.query(sql)
              // console.log('addRefundRes',addRefundRes)
              // console.log('addRefundRes',addRefundRes.rows[0])
              resolve({status: "success", "message": "Refund request have been submitted successfully!", confirmationNo: confirmationNo, refundId: addRefundRes.rows[0].refund_id})
          } else{
              // else 이미 환불데이타가 저장되어 있다면,
              resolve({status: "warning", "message": [`${data.policyNum} policy has already requested a refund.`], warningCode:'D', confirmationNo:'' })
          }
        }else{
          resolve({status: "warning", "message": [`${data.firstName} ${data.lastName} - ${data.policyNum} policy. We can not found.`], warningCode:'W', confirmationNo:'' })
        }
        

      } catch (err) {
        console.log('Adding Refund Request is fail  : ', err.message )
        reject(err.message)
        }
  })
}

// search policy
function searchPolicy (data) {
  return new Promise(async (resolve, reject) => {
    try{
        // console.log('refunds.js function: searchPolicy ') 
        const today = new Date().toISOString().substring(0,10)
        // 1.check inured plans
        const searchPoliceSql = `select p.firstname, p.lastname , to_char(p.birthdate,'YYYY-MM-DD') "birthdate", i.policy_number, to_char(i.effective_date,'YYYY-MM-DD') "effectiveDate", 
                                        a.vendor_id "vendorId", a.application_id "applicationId", i.insured_person_id "personId"
                                  from insured_plan i
                                  join application a on a.application_id = i.application_id
                                  join insured_person p on p.person_id = i.insured_person_id
                                                            and lower(replace(p.firstname, ' ', '')) = lower(replace('${data.firstName}', ' ', ''))
                                                            and lower(replace(p.lastname, ' ', '')) = lower(replace('${data.lastName}', ' ', ''))
                                  where policy_number = '${data.policyNum}'
                                  and i.expiry_date > '${today}'
                                `
        // console.log('searchPoliceSql',searchPoliceSql)
        const searchPoliceRes = await pool.query(searchPoliceSql)
        if (searchPoliceRes.rowCount > 0){
          resolve({rows: searchPoliceRes.rows})
        }else{
          // 2.check Zoho Sales if not existed in inured plans
          const searchZSPoliceSql = `select  z.firstname , z.lastname , to_char(z.birthdate,'YYYY-MM-DD') "birthdate", z.policy, to_char(z.effective_date,'YYYY-MM-DD') "effectiveDate", 
                                              z.vendor_id "vendorId", z.zoho_sales_id "applicationId" , z.person_id "personId"
                                      from zoho_sales_orders z
                                      where policy = '${data.policyNum}'
                                      and z.expiry_date > '${today}'
                                      and lower(replace(z.firstname, ' ', '')) = lower(replace('${data.firstName}', ' ', ''))
                                      and lower(replace(z.lastname, ' ', '')) = lower(replace('${data.lastName}', ' ', ''))
                                    `
          // console.log('searchZSPoliceSql',searchZSPoliceSql)
          const searchZSPolicRes = await pool.query(searchZSPoliceSql)
          if (searchZSPolicRes.rowCount > 0){
            resolve({rows: searchZSPolicRes.rows})
          }else{
            // 3.send warning message that policy is not found if not existed both inured plans and Zoho Sales 
            resolve({rows: []})
          }
        }        

      } catch (err) {
        // console.log('searchPolicy  : ', err.message )
        reject(err.message)
        }
  })
}

// search requested refund
function searchRefundRequested (data) {

  return new Promise(async (resolve, reject) => {
    try{
        // console.log('refunds.js function: searchRefundRequested') 
        // 1.check inured plans
        const searchRefundSql = `select refund_id
                                  from insured_refund r
                                  where policy_number = '${data.policyNum}'
                                  and effective_date = '${data.effectiveDate}'
                                  and lower(replace(r.firstname, ' ', '')) = lower(replace('${data.firstName}', ' ', ''))
                                  and lower(replace(r.lastname, ' ', '')) = lower(replace('${data.lastName}', ' ', ''))
                                `
        const searchRefundRes = await pool.query(searchRefundSql)
        if (searchRefundRes.rowCount > 0){
          resolve({rows: searchRefundRes.rows})
          }else{
            // if existed 
            resolve({rows: []})
        }        

      } catch (err) {
        // console.log('searchRefundRequested  : ', err.message )
        reject(err.message)
        }
  })
}


router.post('/send_email_provider', async(req, res) => {
  try {
      // console.log('refunds.js post /send_email_provider')
      const today = new Date().toISOString().substring(0,10);

      // get provider email address
      const emailAddress = [
        {company : 'Allianz', email: 'refunds@allianz-assistance.ca'},
        {company : 'Tugo', email: 'refunds@tugo.com'},
        {company : 'BlueCross', email: 'info.partners@qc.bluecross.ca'}
      ]

      const requestData = req.body.insured;
      
      const providerEmail = emailAddress.filter(f=>f.company===requestData[0].insurance_company)[0].email;
      const policyNum = requestData[0].policy_number;
      const attachFiles = req.body.attachments;

      var attachmentList = [];
      // get file from S3 and set
      for (const i in attachFiles) {
          const file = await sendToS3.getFromS3(`${attachFiles[i].type}/${attachFiles[i].fileName}`)
          attachmentList.push({filename: attachFiles[i].fileName,
                      content: file.Body,
                      contentType: file.ContentType
                    })
      }

      if (providerEmail){
          // set sendInfo
          const sendInfo = {providerEmail: providerEmail,
                        policyNum : policyNum,
                        mailAttachedFile: attachmentList
          };
          
          // 1.send email
          let mailOptions = await requestToProvider.refundRequestToProvider(sendInfo)
          // send email to client 
          const sendResult =  await mailer.sendEmail(mailOptions)

          // 2.update insured_refund if sent email successfully
          if (sendResult.accepted.length > 0){
            //update insured_refund
            for (const i in requestData) {
                // set email_provider , email_date
                const updateSql = `update insured_refund 
                                    set email_provider = $1,
                                        email_date = $2
                          where refund_id= '${requestData[i].refund_id}'`
                const reqData = [true, today]
                await pool.query(updateSql, reqData)
            }
          }

          res.status(200).json({
            "status":"success",
            "message": `Sent to ${providerEmail} successfully`,
            })
      } //if providerEmail
      else{
        res.status(200).json({
          "status":"warning",
          "message": "Not found provider's email address",
          })
      }

    } catch (err) {
    // console.error(err.message)
    res.send({
      "status":"error",
      "message": "Something went wrong",
      })
    }
})



// Update refund
router.put('/update/process/refund_id=:refund_id', upload, async(req, res) => {
  try {
        // console.log('insured_refunds.js put /update/process/refund_id=:refund_id')

        // console.log('req.params.refund_id',req.params.refund_id)
        const refundData = req.body
        refundData.status = (refundData.refunded==='Fully'||refundData.refunded==='Partially')?'Refunded':refundData.refunded;
        refundData.email_provider = refundData.email_date?true:false;
        refundData.email_date = refundData.email_date.length===10?refundData.email_date:common.momentTimeZone(refundData.email_date, refundData.timeZone);
        refundData.refunded = refundData.refunded !=='Requested'? refundData.refunded:null ;
        refundData.refund_date =  (refundData.refunded !=='Requested' && refundData.refund_date)? common.momentTimeZone(refundData.refund_date, refundData.timeZone):null ;
        refundData.refund_amount = (refundData.refunded !=='Requested' && refundData.refund_date)? refundData.refund_amount:null;
        refundData.admin_fee = (refundData.refunded !=='Requested' && refundData.refund_date)? refundData.admin_fee:null;
        refundData.discounted_amount = (refundData.refunded !=='Requested' && refundData.refund_date)? refundData.discounted_amount:null;
        refundData.actual_refund_amount_sent = (refundData.refunded !=='Requested' && refundData.refund_date)? refundData.actual_refund_amount_sent:null;
        refundData.refund_payment_method = (refundData.refunded !=='Requested' && refundData.refund_date)? refundData.refund_payment_method:null;
        refundData.etransfer_email = (refundData.refunded !=='Requested' && refundData.refund_date)? refundData.etransfer_email:null;
        refundData.etransfer_recipient = (refundData.refunded !=='Requested' && refundData.refund_date)? refundData.etransfer_recipient:null;
        refundData.etransfer_refund_date =  (refundData.refunded !=='Requested' && refundData.refund_date && refundData.etransfer_refund_date)? common.momentTimeZone(refundData.etransfer_refund_date, refundData.timeZone):null ;

        // console.log('refundData',refundData)
        // update
        await updateProcess(req.params.refund_id, refundData)
        // update to ZCRM
        if (refundData.refunded && refundData.refund_date){
          // get token to access Zoho CRM
          const accessZcrm = await zcrmAPI.accessZoho()
            // check existed records
            const searchContactsRes =  await zcrmAPI.searchRecord({
              token : accessZcrm.token,
              url : 'https://www.zohoapis.com/crm/v2/Contacts/search',
              parameters: {
                'criteria': `((First_Name:equals:${refundData.firstname}) and (Last_Name:equals:${refundData.lastname}) and (Date_of_Birth:equals:${refundData.birthdate}))`,
              }
            })

            if (searchContactsRes.id){
              // 1 contact 있으면
              //1.2 check existed sales order                                  
                  const searchSalesRes =  await zcrmAPI.searchRecord({
                    token : accessZcrm.token,
                    url : 'https://www.zohoapis.com/crm/v2/Sales_Orders/search',
                    parameters: {
                      'criteria': `((Contact_Name.id:equals:${searchContactsRes.id}) and (Effective_Date:equals:${refundData.effective_date}) and (Subject:equals:${refundData.policy_number}))`
                    }
                  })
                  // 1.2.1 update sales order if existed sales order
                  if (searchSalesRes.id){
                      // console.log(' Sales orders is already existed, refund data will be updated')
                      await zcrmAPI.updateSalesRefundToZoho(accessZcrm.token, searchSalesRes.id, refundData )
                  } // end... if (searchSalesRes.id)

            } // end... if (searchContactsRes.id)

        } // end... if(refundData.refunded && refundData.refund_date)
        res.send({status: 'success', message: 'The update has been completed successfully.', row: []})

  } catch (err) {
    // console.log('Error  : ', err )
    res.send({status: 'error', message: 'Something went wrong!', row:[]})
  }
})

// update application process status
function updateProcess (refund_id, data) {

  return new Promise(async (resolve, reject) => {
    try{
        // console.log('insured_refunds.js function: updateProcess ') 
        
        let sql = `update insured_refund 
                      set email_provider = $1,
                          email_date = $2,
                          status = $3,
                          refunded = $4,
                          refund_date = $5,
                          refund_amount = $6,
                          admin_fee = $7,
                          discounted_amount = $8,
                          actual_refund_amount_sent = $9,
                          refund_payment_method = $10,
                          etransfer_email = $11,
                          etransfer_recipient = $12,
                          etransfer_refund_date = $13,
                          updated_by = $14
            where refund_id = '${refund_id}' returning *`
        let reqData = [data.email_provider, 
                        data.email_date,
                        data.status,
                        data.refunded,
                        data.refund_date,
                        parseFloat(data.refund_amount)>0?parseFloat(data.refund_amount):null,
                        parseFloat(data.admin_fee)>0?parseFloat(data.admin_fee):null,
                        parseFloat(data.discounted_amount)>0?parseFloat(data.discounted_amount):null,
                        parseFloat(data.actual_refund_amount_sent)>0?parseFloat(data.actual_refund_amount_sent):null,
                        data.refund_payment_method,
                        data.etransfer_email,
                        data.etransfer_recipient,
                        data.etransfer_refund_date,
                        data.userID
                      ]
        const result = await pool.query(sql, reqData)
        if (result.rowCount !== 0) {
          // console.log(result.rows[0].refund_id + ' process status has been updated' )
          // resolve({status: 200, message: 'success'})
          resolve({status: 200, message: 'success', row: result.rows[0].refund_id})
        }else{
          reject(err.message)
        }
    } catch (err) {
      // console.log('updating process is fail  : ', err.message )
      reject(err.message)
      }
  })
}




const refundGetSql = (id) => {
// function getSql (id) {
  let sql = `select ir.refund_id "refundId", ir.confirmation_no "confirmationNo", ir.request_date "requestDate", ir.firstname "firstName", ir.lastname "lastName", ir.birthdate "birthDate", ir.email, 
                    ir.insurance_company "insuranceCompany", ir.policy_number "policyNumber" , ir.effective_date "effectiveDate", ir.reason, a.prefer_language 
              from insured_refund ir
              left join application a on a.application_id = ir.application_id
              where ir.refund_id in ('${id}') `
  return sql
}


module.exports = router;
module.exports.refundGetSql = refundGetSql;