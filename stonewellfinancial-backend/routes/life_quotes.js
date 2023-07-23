require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')
const common  = require('./common')


// GET all life_quotes
router.get('/', async (req, res) => {
  try {
      // console.log('life_quotes.js get /')
      let sql = lifeSqlStatement()
      pool.query(sql, function (err, result) {
        if (!err) {
          return res.status(200).json({ data: result.rows })
        }
      })
  } catch (err) {
    console.error(err.message)
  }
})

// GET Life Quote by user_id
router.get('/list/user_id=:user_id', (req, res) => {
  //   try {
  //       console.log(`travel_applications.js get /list/fr=:fr&to=:to`)
  //       console.log(`travel_applications.js get /list/fr='${req.params.fr}'&to='${req.params.to}'`)
    try {
      console.log('life_quotes.js get /list/user_id=:user_id')
  
      let sql = lifeGetSql('LQT0000001')

      pool.query(sql, function (err, result) {
        if (!err) {
          return res.status(200).json({ data: result.rows })
        }
        else{
          console.error(err.message)
        }
      })
    } catch (err) {
      console.error(err.message)
    }
  })


// Create new life insurance quote
router.post('/add', async(req, res) => {
  try {
      console.log('life_quotes.js post /add')
      console.log('*** Life Insurance quotation is submitting... ***')

      // add life quote => single data
      const addingLifeQuoteResult = await addLifeQuote(req.body)

      const quotation = addingLifeQuoteResult.row
  
      if (quotation){
          console.log(`*** ${quotation.quote_id}  Life quotation submitted. ***`)
          res.status(200).json({
            "status":"success",
            "message": "Life Insurance quotation have been submitted successfully",
            "data": quotation.confirmation_no
            })

          // send confirmation email
          // get data
          const collectData = await common.getData(lifeGetSql(quotation.quote_id))
          // send confirmation email
          const sendingEmailResut = await common.sendConfirmEmail('Life', collectData.data)
          console.log(`*** ${quotation.confirmation_no}  ${sendingEmailResut.message} ***`)

      }  //if (quotation)


    } catch (err) {
      console.log('*** Catch Error: Life Insurance quotation is not submitted. ***')
      console.error(err)
      // rollback
      res.status(400).json({
        "status":"fail",
        "message": "Life Insurance quotation is not submitted",
        "data": ''
        })
  }
})

// save life quote information 
function addLifeQuote (data) {

  return new Promise(async (resolve, reject) => {
    try{

        console.log('life_quotes.js function: addLifeQuote ') 

        // set datetime as timezone at the moment 
        data.birthDate = common.momentTimeZone(data.birthDate, data.timeZone)

        let insuredPerson =  await common.addInsuredPerson('Life', '', data)

        let sql = `insert into life_quote (product_type, product_kind, benefit_amount, 
                                            insured_person_id, smoke_status, health_status,
                                            phone, email, contact_method) 
                    values ('${data.productType}', '${data.productKind}', '${data.benefitAmount}', 
                            '${insuredPerson.personId}', '${data.smokeStatus}', '${data.healthStatusDesc}',
                             '${data.phone}', '${data.email}', '${data.contactMethod}') returning * `
        // console.log(sql)
        await pool.query(sql)
          .then((result) => {
                if (result.rows[0].quote_id)
                {        
                  console.log(result.rows[0].quote_id + ' quote information have been added successfully' )          
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
        console.log('Adding life quotation information is fail  : ', err.message )
        reject(err.message)
        }
  })
}

const lifeSqlStatement = () => {
  let sql = `select lq.quote_id "quoteID", lq.confirmation_no "confirmationNo", lq.quote_date "quoteDate", 
                    lq.product_type "productType", 
                    (CASE lq.product_type 
                              WHEN 'Term' THEN 'Term Insurance'
                              WHEN 'Whole' THEN 'Whole Life' 
                              WHEN 'Universal' THEN 'Universal Life'
                              ELSE lq.product_type END) "productTypeDesc",
                    lq.product_kind "productKind", 
                    (CASE lq.product_kind 
                              WHEN 'Term10' THEN 'Term 10'
                              WHEN 'Term15' THEN 'Term 15' 
                              WHEN 'Term20' THEN 'Term 20'
                              WHEN 'Term25' THEN 'Term 25'
                              WHEN 'Term30' THEN 'Term 30' 
                              WHEN 'Term100' THEN 'Term 100'
                              WHEN 'Life' THEN 'Life time payment'
                              WHEN '15Years' THEN '15 year payment' 
                              WHEN '20Years' THEN '20 year payment'
                              ELSE lq.product_kind END) "productKindDesc",       
                    lq.benefit_amount "benefitAmount",
                    iperson.firstname "firstName", iperson.lastname "lastName", iperson.gender , iperson.birthdate "birthDate",
                    lq.smoke_status "smokeStatus", 
                    (CASE lq.health_status
                      WHEN 'VeryG' THEN 'Very Good'
                      WHEN 'Good' THEN 'Good with minor illness' 
                      WHEN 'Medical' THEN 'Existing medical conditions'
                      ELSE lq.health_status END) "healthStatus", 
                    lq.phone , lq.email, lq.contact_method "contactMethod"
              from life_quote lq 
              join insured_person iperson  on iperson.person_id =  lq.insured_person_id
              `
  return sql
}


const lifeGetSql = (id) => {
  let sql = lifeSqlStatement() + ' ' + 
            `where lq.quote_id = '${id}' `
  return sql
}





module.exports = router
module.exports.lifeGetSql = lifeGetSql;