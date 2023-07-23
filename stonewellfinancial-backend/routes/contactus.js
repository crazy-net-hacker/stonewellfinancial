require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')
const mailer = require('../middlewares/emailService/mailer')

const formSubmissionTemplate = require('../middlewares/emailService/templates/contactFormSubmission')


// GET all list of contacted us
router.get('/', async (req, res) => {
  try {
    console.log('contactus.js get /')
    let sql = 'select * from contactus'
    pool.query(sql, function (err, result) {
      if (!err) {
        return res.status(200).json({ data: result })
      }
    })
  } catch (err) {
    console.error(err.message)
  }
})


// Create new contacted us
router.post('/add', async(req, res) => {
  try {
      console.log('contactus.js post /add') 
      let reqData = req.body
      let sql = `insert into contactus (firstname, lastname, email,
                              phone, user_id, content, status ) 
                    values ('${reqData.firstName}', '${reqData.lastName}', '${reqData.emailAdd}', 
                            '${reqData.phoneNum}', '${reqData.userID}', '${reqData.reqMessage}','${reqData.status}') returning * `
      // console.log(sql)
      await pool.query(sql)
        .then((result) => {
              console.log(result.rows[0].contact_id)
              console.log('Request has been added successfully' )
              
                console.log(`*** ${result.rows[0].confirmation_no} Request has been submitted. ***`)
                res.status(200).json({
                  "status":"success",
                  "message": "Request has been sumbitted successfully",
                  "data": result.rows[0].confirmation_no
                  })
              
              // send email
              sendConfirmEmail(reqData)

        }).catch((err) => {
              res.json({
                data: err.message
                })
        })

      } catch (err) {
        console.log('*** Error: It is not submitted. ***')
        res.send({ err })    
  }
})

// send confirmation Email
function sendConfirmEmail (data) {
  return new Promise(async resolve => {
  try{
    // quote confirmation template
    let mailOptions = await formSubmissionTemplate.formSubmissionMailOptions(data);
    // send email to client 
    await mailer.sendEmail(mailOptions)
    // let resultMailer = await mailer.sendEmail(mailOptions)
    //  console.log('Life Quote Confirmation mail sending result : ', resultMailer )
    resolve(mailOptions)
  } catch (err) {
    console.log('Contact Form Submission mail sending error : ', err.message )
    // res.status(500).send({
    //   "status":"fail",
    //   "message": "fail to send email for Quote Confirmation"
    // })
  }
  })

}


module.exports = router
