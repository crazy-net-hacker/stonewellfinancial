require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')
const common  = require('./common')
// send email
const mailer = require('../middlewares/emailService/mailer')
const creditcardPaymentRequest = require('../middlewares/emailService/templates/creditcardPaymentRequest')

// GET all list of credit cards
router.get('/', async (req, res) => {
  try {
    // console.log('credit_card.js get /')
    let sql = 'select * from creditcard'
    pool.query(sql, function (err, result) {
      if (!err) {
        return res.status(200).json({ data: result })
      }
    })
  } catch (err) {
    console.error(err.message)
  }
})

// GET credit cards
router.get('/fr=:fr&to=:to&vendor_id=:vendor_id', async(req, res) => {
  try {
    // console.log('credit_card.js get /fr=:fr&to=:to&vendor_id=:vendor_id')
    let sql = `select c.creditcard_id, to_char(c.created_at,'YYYY-MM-DD') "created_at",
                      c.firstname, c.lastname, c.email, c.card_holder, c.creditcard_type, c.creditcard_number, c.card_expired, c.card_cvv, c.payment_amount, c.status
                          from creditcard c
                          where to_char(c.created_at,'YYYY-MM-DD') between '${req.params.fr}' and '${req.params.to}'
                    
              `
    // console.log('sql',sql)
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
    // console.error(err.message)
    res.status(200).json({
      "status": "error",
      "message": "Something went wrong"                
    })
  }
})

// Create new credit card info
router.post('/add', async(req, res) => {
  try {
      // console.log('credit_card.js post /add')
      // console.log('*** Credit Card info is submitting... ***')

      const reqeustedData = req.body; 
      // add credit card
      const creditcardRes = await addCreditCard(reqeustedData)
      if (creditcardRes){
          res.status(200).json({
            "status":"success",
            "message": "Credit Card have been submitted successfully",
            "data": []  //no pass the result data to F/E
            })

          // send email to info@
          let mailOptions = await creditcardPaymentRequest.letterMailOptions(reqeustedData)
          await mailer.sendEmail(mailOptions)

      }  //if (creditcardRes)


  } catch (err) {
        // console.log('*** Catch Error: Credit Card info is not submitted. ***')
        // console.error(err)
        res.status(400).json({
          "status":"fail",
          "message": "Credit Card info is not submitted",
          "data": ''
          })
    }
})

router.put('/update/process/creditcard_id=:creditcard_id', async(req, res) => {
  try {
        // console.log('credit_card.js put /update/creditcard_id=:creditcard_id')
        const creditcard = req.body

        // update status
        const responseUpdateProcess = await updateProcess(req.params.creditcard_id, req.body.status)
        if (responseUpdateProcess.status === 200){

            // add log_note if remark(note) is existed
            // if (application.remark){
            //   let sql = `insert into log_note(application_id , note, status, created_by, updated_by) 
            //                               values ('${req.params.application_id}', '${application.remark}', '${application.app_status}', '${application.userID}', '${application.userID}'
            //                                       ) returning * `
            //   await pool.query(sql)
            // }

            if (req.body.app_status === 'Approved'){
              

            } //if (req.body.app_status === 'Approved') ... end

            // send email to vendor user when update status as Draft if created by vendor user
            else if (req.body.status === 'Draft'){

                  // get sendor email 
                  // var sql = `select acc.firstname, acc.lastname, acc.email 
                  //             from application app 
                  //             join account acc on acc.user_id = app.created_by
                  //             where app.application_id = '${req.params.application_id}'
                  //             and source_from = 'V'`
                  // const response = await pool.query(sql)
                  // if (response.rows && response.rows.length > 0 ){
                  //     const data = { 
                  //       application_id : req.params.application_id,
                  //       creatorEmail : response.rows[0].email, 
                  //       creatorFullName: `${response.rows[0].firstname} ${response.rows[0].lastname}`,
                  //       remark: application.remark 
                  //     }

                  // }
                
            } //if (req.body.app_status === 'Draft' && application.source_from === 'V') ... end

            // send email to insured contact person and vendor when update status as Void
            else  if (req.body.app_status === 'Void' ){
                      // const data = { 
                      //   application_id : req.params.application_id,
                      //   email : application.email, 
                      //   contactName : application.contact_name,
                      //   vendor_email : application.vendor_email, 
                      //   remark: application.remark,
                      //   person: person
                      // }
            } 
        } 
        res.send({status: 'success', message: 'The cc update has been completed successfully.', row: []})

  } catch (err) {
    // console.log('Error  : ', err.message )
    res.send({status: 'error', message: 'Something went wrong!', row:[]})
  }
})



// save credit card info
function addCreditCard (data) {

  return new Promise(async (resolve, reject) => {
    try{

        // console.log('credit_card.js function: addCreditCard ') 
        let sql = `insert into creditcard (firstname, lastname, email, creditcard_type, creditcard_number, card_holder, card_cvv, card_expired, payment_amount, status) 
                      values ('${data.firstName}', '${data.lastName}', '${data.email}', '${data.creditCardType}', '${data.creditCardNumber}',
                              '${data.cardHolderName}', '${data.cardcvv}', '${data.cardExpired}', '${data.paymentAmount}', '${data.status?data.status:'Pending'}'
                              ) returning * `
        // console.log(sql)
        await pool.query(sql)
          .then((result) => {
                if (result.rows[0].creditcard_id)
                {        
                  // console.log(result.rows[0].creditcard_id + ' credit card info have been added successfully' )          
                  resolve({status: 200, message: 'success', row: result.rows[0] })
                }else{
                  reject(err.message)
                }
          }).catch((err) => { 
            // console.log('Error  : ', err.message )
            reject(err.message)
            }
        )        

    } catch (err) {
      // console.log('Adding credit card info is fail  : ', err.message )
      reject(err.message)
      }
  })
}

// update credit card process status
function updateProcess (creditcard_id, status) {

  return new Promise(async (resolve, reject) => {
    try{
        // console.log('credit_card.js function: updateProcess ') 

        let sql = `update creditcard set status = $1
            where creditcard_id = '${creditcard_id}' returning *`
        let reqData = [status]
        const result = await pool.query(sql, reqData)
        if (result.rowCount !== 0) {
          // console.log(result.rows[0].creditcard_id + ' process status has been updated' )
          // resolve({status: 200, message: 'success'})
          resolve({status: 200, message: 'success', row: result.rows[0].creditcard_id})
        }else{
          reject(err.message)
        }
    } catch (err) {
      // console.log('cc updating process is fail  : ', err )
      reject(err.message)
      }
  })
}


module.exports = router
