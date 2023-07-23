require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')
const common  = require('./common')
const account  = require('./accounts')

const mailer = require('../middlewares/emailService/mailer')
const vendorInfoUpdatedNotice = require('../middlewares/emailService/templates/vendorInfoUpdatedNotice')
const vendorApplication = require('../middlewares/emailService/templates/vendorApplication') 
// Create a vendor
// router.post('/add', async(req, res) => {
//   try {
//       // console.log('vendor_accounts.js post /add')
//                 res.status(200).json({
//                   "status":"success",
//                   "message": "registration has been sumbitted successfully",
//                   "data": '12'
//                   })
//       } catch (err) {
//         console.log('*** Error: It is not submitted. ***')
//         res.send({ err })
//   }
// })

router.post('/add', async(req, res) => {
  try {
      // console.log('vendor_accounts.js post /add')
      let reqData = req.body
      // 신청하는 시점에는 prefer_language, rate, zoho_account_id 를 관리하지 않고, is_active 를 false 함 .
      // approve 가 되는 시점에 prefer_language, rate, zoho_account_id , vendor_code 를 관리하도록 함.
      let sql = `insert into vendor(vendor_name, vendor_code , firstname , lastname ,
                              email , phone , prefer_language, rate, is_active, access_code, 
                              annual_clients, client_provinces, vendor_type, mailling_in,  is_manager, employee_number)
                    values('${reqData.companyName}', null,'${reqData.firstName}','${reqData.lastName}',
                            '${reqData.email}','${reqData.phone}', null, 0, false, substr(md5('${reqData.companyName}' ::text), 0, 16),
                            ${reqData.estimatedClientNumber}, '${reqData.clientProvince}', '${reqData.vendorType}', '${reqData.MailingInCanada}', '${reqData.IsManager}', '${reqData.employeeNumber}'
                          ) returning *`
      // send email 
      let mailOptions = await vendorApplication.letterMailOptions(reqData)
      await mailer.sendEmail(mailOptions)
      
      await pool.query(sql)
        .then((result) => {
              // console.log(result.rows[0].vendor_id)
              // add address => single data based on primary contact address in
              let officeAddress = {
                addressType: '',
                officeInCanada: '',
                street: req.body.street,
                suiteNo: req.body.suiteNo,
                city: req.body.city,
                province: req.body.province,
                postalcode: req.body.postalCode,
                country: req.body.country,
                useType: 'Mailling',
                isMailing: false
              };
              const addingOfficeAddressResult =  common.addAddressInfo('Vendor', result.rows[0].vendor_id, officeAddress)
              // check result
              if (addingOfficeAddressResult.rowCount === 0) {
                reject({status: 400, message: err.message})
              }
                // console.log(`*** ${result.rows[0].access_code} registration has been submitted. ***`)
                res.status(200).json({
                  "status":"success",
                  "message": "registration has been sumbitted successfully",
                  "data": result.rows[0].access_code
                  })
              // send email
              // sendConfirmEmail(reqData)
            })
        .catch((err) => {
              console.log('Error  : ', err.message )
              reject({status: 400, message: err.message})
            })
      } catch (err) {
        console.log('*** Error: It is not submitted. ***')
        res.send({ err })
  }
})

// update vendor info
router.put('/update/update_target=:update_target&vendor_id=:vendor_id', async (req, res) => {
  try {
    // console.log('vendor_accounts.js put /update/update_target=:update_target&vendor_id=:vendor_id')
    let reqData = req.body
    // let reqData = req.body
    if (req.params.update_target === 'info'){
        const updateSql = `update vendor
                              set vendor_name = $1, 
                                  firstname = $2, 
                                  lastname = $3,
                                  email = $4,
                                  phone = $5
                            where vendor_id = '${req.params.vendor_id}' 
                            returning * `
        const udpateData = [reqData.vendor_name, reqData.firstname , reqData.lastname , reqData.email , reqData.phone]
        const updateResult = await pool.query(updateSql,udpateData)
        if (updateResult.rowCount !== 0) {
            // update address
            const updateAddSql = `update address 
                                    set street = $1, 
                                        suite_no = $2, 
                                        city = $3, 
                                        province = $4, 
                                        postalcode = $5, 
                                        country = $6 
                                  where source_type ='Vendor' 
                                    and source_id = '${req.params.vendor_id}'         
                                    and use_type = 'Mailling'  
                                  returning * `
            const udpateAddData = [reqData.street, reqData.suite_no, reqData.city, reqData.province, reqData.postalcode, reqData.country]
            const updateAddResult = await pool.query(updateAddSql,udpateAddData)
            if (updateAddResult.rowCount !== 0) {
                if (reqData.updatedByVendor===true){
                    // send updated notice email to sales@
                    let mailOptions = await vendorInfoUpdatedNotice.letterMailOptions(reqData)
                    await mailer.sendEmail(mailOptions)
                }
                res.status(200).json({
                  "status": "success",
                  "message": "Updated successfully!"
                })  
          }
        }

    } else if (req.params.update_target === 'status'){
      const updateSql = `update vendor
                            set is_active = $1,
                                vendor_code = $2,
                                zoho_account_id = $3,
                                zoho_carewell_account_id = $4,
                                rate = $5,
                                allow_email_client = $6
                            where vendor_id = '${req.params.vendor_id}' 
                            returning * `
      const udpateData = [reqData.is_active, reqData.vendor_code?reqData.vendor_code:null, reqData.zoho_account_id, reqData.zoho_carewell_account_id, reqData.rate?reqData.rate:0, reqData.allow_email_client]
      const updateResult = await pool.query(updateSql,udpateData)
        if (updateResult.rowCount !== 0) {

            // if is_active === false, all user of vendor can not access anymore.
            if (reqData.is_active === false){
                const updateVendorUserSql = 
                      `update vendor_account
                          set is_active = $1, 
                              expiry_date = $2
                          where vendor_id = '${req.params.vendor_id}' 
                          returning * `
                  const updateVendorUserData = [reqData.is_active, new Date()]
                  await pool.query(updateVendorUserSql,updateVendorUserData)
            }

            res.status(200).json({
              "status": "success",
              "message": "Updated successfully!"
            })  

        }
    } else{
      res.status(200).json({
        "status":"error",
        "message": "Something went wrong",
      })  
    }
    

  } catch (err) {
    console.error(err.message)
    res.send({
      "status":"error",
      "message": "Something went wrong",
      })
  }
})


// add vendor user account
router.post('/user/add', async (req, res) => {
  try {
    // console.log('vendor_accounts.js post /user/add')

    let reqData = req.body;
    reqData.roleId = 'VEN';
    // register user account
    const user = await account.signup(reqData)
    if (user.status === 'success'){

        const searchsql = `select * from vendor_account where user_id ='${user.data.user_id}'`
        const searchResult = await pool.query(searchsql)
        if (searchResult.rowCount === 0) {
            // connect vendor user account
            const activeDate = reqData.activeDate? `'${reqData.activeDate.slice(0, 10)}'`:null;
            const closeDate = reqData.closeDate?`'${reqData.closeDate.slice(0, 10)}'`:null
            const sql = `insert into vendor_account(vendor_id, user_id, vendor_role, is_active, active_date, expiry_date)
                                            values('${reqData.vendor_id}', '${user.data.user_id}', '${reqData.vendorRole}', ${reqData.isActive},  ${activeDate}, ${closeDate})
                                              returning *`
            const addResult =  pool.query(sql)

            if (addResult.rowCount !== 0) {
                  // send email to reset password    
                  const noticeData = {
                    email : reqData.email,
                    name : `${reqData.firstName} ${reqData.lastName}`,
                    linkUrl: 'https://www.stonewellfinancial.com/reset-password'
                    // linkUrl: 'http://localhost:3000/reset-password'
                  }             
                  // send email with verification code  
                  await account.sendverifyEmail('Register', noticeData) 

                  res.status(200).json({
                      "status": "success",
                      "message": "Registered successfully!"
                  })
            }else{
              res.status(200).json({
                  "status": "error",
                  "message": "Something went wrong"                
                })
            }

        }else{
          //user exists in vendor_account
          res.status(200).json({
            "status": "error",
            "message": "Check user!"
          })
        }
    
    }else{
      //user exists in account
      res.status(200).json({
        "status": user.status,
        "message": user.message
      })

    }

  } catch (err) {
    // console.error(err.message)
    res.send({
      "status":"error",
      "message": err.message?err.message:"Something went wrong"
      })
  }
})

// update vendor user account
router.put('/user/update/vendor_id=:vendor_id&user_id=:user_id', async (req, res) => {
  try {
    // console.log('vendor_accounts.js put /user/update/vendor_id=:vendor_id&user_id=:user_id')

    let reqData = req.body
    
    const updateSql = `update vendor_account
                        set vendor_role = $1, 
                            is_active = $2, 
                            active_date = $3, 
                            expiry_date = $4
                        where vendor_id = '${req.params.vendor_id}' 
                        and user_id = '${req.params.user_id}'
                        returning * `
    const udpateData = [reqData.vendorRole, reqData.isActive, reqData.activeDate?reqData.activeDate.slice(0, 10):null, reqData.closeDate?reqData.closeDate.slice(0, 10):null]
    const updateResult = await pool.query(updateSql,udpateData)
    if (updateResult.rowCount !== 0) {
        res.status(200).json({
          "status": "success",
          "message": "Updated successfully!"
        })  
    }

  } catch (err) {
    console.error(err.message)
    res.send({
      "status":"error",
      "message": "Something went wrong",
      })
  }
})


// GET all vendors
router.get('/', async (req, res) => {
  try {
    // console.log('vendors.js get /')
    // will be changed joined address table as address 'not address_zoho'
    let sql = vendorAccountSqlStatement() + ' ' + 
              `order by v.vendor_id
              `
    pool.query(sql, function (err, result) {
      if (!err) {
        if (result.rowCount > 0){ 
        return res.status(200).json({ data: result.rows, message : `${result.rowCount} Data found` }) 
        } else {
        return res.status(400).send({ data: result.rows, message: 'No Data Found' })
        }
      }
      else{
        console.error(err.message)
        return res.status(404).send({ error: 'System Error' })
      }
    })
  } catch (err) {
    console.error(err.message)
    return res.status(500).send({ error: 'System Error' })
  }
})

// GET a vendor
router.get('/access/access_code=:access_id', async (req, res) => {
  try {
    // console.log('vendors.js get /access/access_code=:access_id')

    let sql = vendorAccountSqlStatement() + ' ' + 
              `where access_code = '${req.params.access_id}'
              order by v.vendor_id`
                              
    pool.query(sql, function (err, result) {
      if (!err) {
        if (result.rowCount > 0){ 
        return res.status(200).json({ data: result.rows, message : `${result.rowCount} Data found` }) 
        } else {
        return res.status(400).send({ data: result.rows, message: 'No Data Found' })
        }
      }
      else{
        console.error(err.message)
        return res.status(404).send({ error: 'System Error' })
      }
    })
  } catch (err) {
    console.error(err.message)
    return res.status(500).send({ error: 'System Error' })
  }
})



const vendorAccountSqlStatement = () => {
  let sql = `select v.vendor_id, v.vendor_name, v.vendor_code, v.firstname, v.lastname , v.email, v.phone, v.description, 
                    v.annual_clients, client_provinces, 
                    v.access_code, v.rate, v.logo, v.is_active, zoho_account_id, zoho_carewell_account_id,
                    a.address_type, a.street, a.suite_no, a.city, a.province, a.postalcode, 
                    a.country, (select name from country where country_code = a.country) countryName, 
                    a.is_mailing, v.allow_email_client
              from vendor v
              left join (select * from address where source_type ='Vendor' and use_type='Mailling') a on a.source_id = v.vendor_id 
              `
  return sql
}



module.exports = router

