require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const fetch = require('node-fetch')
const mailer = require('../middlewares/emailService/mailer')
const verificationLetter = require('../middlewares/emailService/templates/verificationLetter')


// GET an account(user)
router.get('/users/vendor_id=:vendor_id', async (req, res) => {
  try {
    // console.log('accounts.js get /list/vendor_id=:vendor_id')
    let sql = `select a.user_id, firstname "firstName", lastname "lastName", phone, email, role_id "role",  
                      to_char(a.created_at,'YYYY-MM-DD') "createdAt",
                      ven.is_active "isActive", ven.vendor_role "vendorRole", 
                      ven.active_date "activeDate", ven.expiry_date "closeDate", 
                      ven.vendor_id, ven.vendor_name
                  from account a
                  left join (select va.user_id, va.is_active, va.vendor_role, 
                                    to_char(va.active_date,'YYYY-MM-DD') active_date, 
                                    to_char(va.expiry_date,'YYYY-MM-DD') expiry_date,  
                                    va.vendor_id, v.vendor_name
                              from vendor_account va 
                              join vendor v on v.vendor_id = va.vendor_id) ven on ven.user_id = a.user_id `
    if(req.params.vendor_id !=='*'){
      sql = sql + `where ven.vendor_id like '${req.params.vendor_id==='*'?'%':req.params.vendor_id}' ` 
    } 
    const result = await pool.query(sql)
    if (result.rowCount > 0) {
      return res.status(200).json({ data: result.rows })
    } else {
      return res.status(200).json({ data: [] })
    }
    
  } catch (err) {
    console.error(err.message)
  }
})


// GET an account(user) by email
router.get('/auth/email=:email', async (req, res) => {
  try {
    // console.log('accounts.js get /auth/:email',req.params.email)
    let sql = `select a.user_id, a.firstname, a.lastname, a.phone, a.role_id ,
                      va.vendor_id, va.vendor_role,
                      (select COALESCE(json_agg(
                                      json_build_object(
                                          'vendorName', v.vendor_name,
                                          'vendorEmail', v.email,  
                                          'accessCode', v.access_code,
                                          'rate', v.rate                                          
                                        )),'[]') vendor
                        from vendor v
                        where v.vendor_id = va.vendor_id
                        and v.is_active = true
                      ),
                      (select COALESCE(json_agg(
                                      json_build_object(
                                          'street', a.street,  
                                          'suite_no', a.suite_no, 
                                          'city', a.city, 
                                          'province', a.province, 
                                          'postalcode', a.postalcode                                            
                                        )),'[]') vendor_address
                        from address a
                        where a.source_type = 'Vendor' and source_id = va.vendor_id
                      )
                from account a 
                left join vendor_account va on va.user_id = a.user_id and va.is_active = true
                where email = '${req.params.email}' `
    pool.query(sql, function (err, result) {
      if (!err) {
        return res.status(200).json({ data: result.rows })
      } else console.error(err.message)
      res.send(err)
    })
  } catch (err) {
    console.error(err.message)
  }
})


// validate an account(user) by email
router.get('/look-up/firstname=:firstname&&lastname=:lastname&&email=:email', async (req, res) => {
  try {
    // console.log('accounts.js get /look-up/:email',req.params.email)
    let sql = `select * 
                from account a 
                where a.firstname = '${req.params.firstname}'
                  and a.lastname = '${req.params.lastname}'
                  and a.email = '${req.params.email}'
                  and a.user_id not in (select va.user_id from vendor_account va) `
    // unvalid email
    const result = await pool.query(sql)
    if (result.rowCount !== 0) {
      res.status(409).send({ error: 'invalid email or password' })
    } else {

    }
    // pool.query(sql, function (err, result) {
    //   if (!err) {
    //     return res.status(200).json({ data: result.rows })
    //   } else console.error(err.message)
    //   res.send(err)
    // })
  } catch (err) {
    console.error(err.message)
  }
})


// Sign in
router.post('/sign-in', async (req, res) => {
  try {

    // const randomToken = () => {
    //   crypto.randomBytes(64).toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
    // }
    // console.log(crypto.randomBytes(64).toString('base64'))

    const sql = `select a.*
                  from account a 
                  where email = '${req.body.email}' `
    const result = await pool.query(sql)
  
    // unvalid email
    if (result.rowCount === 0) {
      res.status(404).send({ error: 'invalid email or password' })
    } else {
      // compare salted password
      const saltedPassword = result.rows[0].password
      const successResult = await bcrypt.compare(
        req.body.password,
        saltedPassword
      )

      // logged in successfully, then generate JWT token
      if (successResult === true) {
        //sign my jwt
        const payLoad = {
          email: result.rows[0].email,
          name: result.rows[0].firstname + ' ' + result.rows[0].lastname,
          role: result.rows[0].role_id,
          userId: result.rows[0].user_id,
        }

        const token = jwt.sign(payLoad, process.env.JWT_SECRET, {
          algorithm: 'HS256',
          // expiresIn: '600s', // TODO: set expiring time and manage it
        })

        const refreshtoken = jwt.sign(payLoad, process.env.JWT_REFRESH_SECRET, {
          algorithm: 'HS256',
        })

        // save the refresh token in the database
        pool.query('update account set remember_token = $1 where email = $2', [
          refreshtoken,
          result.rows[0].email,
        ])

        // check if it succeeds..
        res.setHeader('set-cookie', [
          `JWT_TOKEN=${token}; httponly; samesite=lax`,
        ])
        res.status(200).send({
          success: 'Logged in successfully!',
          data: payLoad,
          refreshToken: refreshtoken,
        })
      } else {
        res.status(400).send({ error: 'Incorrect email or password' })
      }
    }
  } catch (err) {
    console.error(err.message)
  }
})

//
// Verify before reset password
router.get('/verify/type=:type', async (req, res) => {
  try {
    let sql = ''    
    if (req.params.type === 'email'){
      sql = `select * 
              from account a 
              where lower(a.email) = '${req.query.email.toLowerCase()}'
                and lower(a.lastname) = '${req.query.lastname.toLowerCase()}' `
    } else{
      // verification code
      sql = `select * 
              from account a 
              where lower(a.email) = '${req.query.email.toLowerCase()}'
                and lower(a.lastname) = '${req.query.lastname.toLowerCase()}' 
                and verification_code = '${req.query.code}'`
    }

    const result = await pool.query(sql)
    if (result.rowCount !== 0) {
      if(req.params.type === 'email'){
        // generate verification code
        let number = ''
        for (let i = 0; i < 6; i++) {
          random = Math.trunc(Math.random() * (9 - 0) + 0)
          number += random
        }

        const verificationCode = number
        const updateSql = `Update account
                              set  verification_code = $1
                              where lower(email) = '${req.query.email.toLowerCase()}'
                                and lower(lastname) = '${req.query.lastname.toLowerCase()}'
                                returning *
                          `
        
        const generateResult = await pool.query(updateSql, [verificationCode])
        if (generateResult.rowCount !== 0) {
            // set data to sending email     
            const data = {
              email : req.query.email,
              code : verificationCode
            }
            // send email with verification code  
            await sendverifyEmail('Password', data)   
        }

      } // end  --if(req.params.type === 'email')
        res.send(
          { status: 'success',
            message: 'verified'
        })


      } else {
        res.send(
          { status: 'error',
            message: req.params.type === 'email'?'Your account could not be found.':'Your verification code could not be found.' }
          )
    }

  } catch (err) {
    console.error(err.message)
    res.send({
      "status":"error",
      "message": "Something went wrong",
      })
  }
})

// Change password(user)
router.put('/change-password/email=:email', async (req, res) => {
  try {
    // console.log('accounts.js put /change-password/email=:email')
    let email = req.params.email
    let password = await bcrypt.hash(req.body.password, 10)
    let sql = `update account set password = $1, verification_code = null where email = '${email}' `
    const result = await pool.query(sql, [password])
    if (result.rowCount !== 0) {
        res.send({ 
          status: 'success',
          message: 'Password were changed successfully'
        })
    }
    // console.log('Password were changed successfully')
  } catch (err) {
    // console.error(err.message)
    res.send({
      "status":"error",
      "message": "Something went wrong",
      })
  }
})



// Sign Out
router.post('/sign-out', async (req, res) => {
  const token = req.body.refreshToken
  if (token) {
    try {
      const sql =
        'update account set remember_token = null where remember_token = $1'
      const result = await pool.query(sql, [token])

      res.send({ success: 'logged out successfully' })
    } catch (err) {
      console.error(err.message)
    }
  }
})

// Create new account(user) for Sign Up
router.post('/sign-up', async (req, res) => {
  console.log('accounts.js post /add')
  // validate ReCAPTHA token
  const isValidReCAPTCHA = await validateReCAPTCHA(req.body.token)
  if (!isValidReCAPTCHA) {
    return res.status(400).json({ error: 'Unvalid ReCAPTCHA Token' })
  }

  try {
    const sql = 'select email from account where email = $1'
    const result = await pool.query(sql, [req.body.email])
    if (result.rowCount > 0) {
      res.status(409).send({ error: 'User already exists..' })
    } else {
      let reqData = req.body
      let roleId = reqData.roleId
      let email = reqData.email
      let password = await bcrypt.hash(reqData.password, 10)
      let firstName = reqData.firstName
      let lastName = reqData.lastName
      let phone = reqData.phone
      let sql =
        `insert into account (role_id, email, password, firstname, lastname, phone) ` +
        ` values ('${roleId}', '${email}', '${password}', '${firstName}', '${lastName}','${phone}')`
      await pool.query(sql)
      res.status(200).send({ success: 'User created successfully' })
    }
  } catch (err) {
    console.error(err.message)
    res.error(err)
  }
})


// signup
function signup (reqData) {

  return new Promise(async (resolve, reject) => {
    try{
        // console.log('accounts.js post function: signup ') 

        const sql = `select email from account where email = '${reqData.email}'`
        const searchResult = await pool.query(sql)
    
        if (searchResult.rowCount > 0) {
          resolve({status: 'error', message: 'User already exists.'})
        } else {
    
          // generate password will be random if account is a vendor user
          // vendor user should be reset manually
          let generatePassword = ''
          if (reqData.roleId === 'VEN'){
              generatePassword = await bcrypt.hash(crypto.randomBytes(8).toString('hex'), 10)
          }
    
          const insertSql =
            `insert into account (role_id, email, password, firstname, lastname) ` +
            ` values ('${reqData.roleId}', '${reqData.email}', '${generatePassword}', '${reqData.firstName}', '${reqData.lastName}') returning *`
          const result  = await pool.query(insertSql)

          if (result.rowCount !== 0) { 
              resolve({status: 'success', message: 'success', data:result.rows[0] })
          }else{
            resolve({status: 'error', message: 'Something went wrong'})
          } 
      
      }

    } catch (err) {
      console.log('Handling signup is fail  : ', err )
      reject(err.message)
      }
  })
}


// Update an account(user)
// router.put('/update/email=:email', async (req, res) => {
//   try {
//     console.log('accounts.js put /update/email=:email')
//     let email = req.params.email
//     let phone = req.body.phone
//     let password = await bcrypt.hash(req.body.password, 10)
//     let sql = `update account set password = '${password}', phone = '${phone}' where email = '${email}'`
//     await pool.query(sql, (err, result) => {
//       if (!err) {
//         res.status(200).json({ success: 'Password updated successfully' })
//       } else {
//         console.error(err.message)
//         res.send(err)
//       }
//     })
//   } catch (err) {
//     console.error(err.message)
//     res.status(400).send({ error: 'Incorrect email or password' })
//   }
// })



// Update an account(user)
// router.put('/update/info/byemail/:email', async (req, res) => {
//   try {
//     console.log('accounts.js put /update/info/byemail')
//     let email = req.params.email
//     let phone = req.body.phone
//     let sql = `update account set phone = '${phone}' where email = '${email}'`
//     await pool.query(sql, (err, result) => {
//       if (!err) {
//         res
//           .status(200)
//           .json({ success: 'account info was updated successfully' })
//       } else {
//         console.error(err.message)
//         res.send(err)
//       }
//     })
//   } catch (err) {
//     console.error(err.message)
//     res.status(400).send({ error: 'Incorrect email or password' })
//   }
// })

// Update an account(admin)
// router.put('/update/byid/:id', async (req, res) => {
//   try {
//     console.log('accounts.js put /update/byid')
//     let reqData = [
//       req.body.role_id,
//       req.body.email,
//       req.body.firstname,
//       req.body.lastname,
//       req.body.phone,
//     ]
//     let sql = `update account set role_id = $1, email = $2, firstname = $3, lastname = $4, phone = $5
//                 where user_id = '${req.params.id}' `
//     await pool.query(sql, reqData, function (err, result) {
//       if (!err) {
//         res.status(200).json({ success: 'User updated successfully' })
//       } else console.error(err.message)
//       res.send(err)
//     })
//   } catch (err) {
//     console.error(err.message)
//     res.status(400).send({ error: err.message })
//   }
// })

// validate ReCAPTCHA
async function validateReCAPTCHA(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
    {
      method: 'POST',
    }
  )
  const data = await response.json()
  return data.success
}


// send email
function sendverifyEmail(source, data) {
  return new Promise(async (resolve, reject) => {
    try {

      let mailOptions = await verificationLetter.letterMailOptions(source, data)
      
      // // send email to client 
      await mailer.sendEmail(mailOptions)
      // console.log(`${data.type} mail sending result : `, resultMailer)
      resolve({status: 'success', message: 'mail has been sent successfully'})

    } catch (err) {
      console.log(`${data.type}  mail sending error : `, err.message)
      reject(err.message)
    }
  })
}

module.exports = router
module.exports.signup = signup;
module.exports.sendverifyEmail = sendverifyEmail;
