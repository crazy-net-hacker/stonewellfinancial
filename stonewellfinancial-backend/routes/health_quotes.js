require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')
const common  = require('./common')


// GET all health_quotations
router.get('/', async (req, res) => {
  try {
      // console.log('health_quotes.js get /')
      let sql = healthSqlStatement()
      pool.query(sql, function (err, result) {
        if (!err) {
          return res.status(200).json({ data: result.rows })
        }
      })
  } catch (err) {
    console.error(err.message)
  }
})

// Create new health insurance quote
router.post('/add', async(req, res) => {
  try {
      // console.log('health_quotes.js post /add')
      // console.log('*** Health Insurance quotation is submitting... ***')

      // add health quote => single data
      const addingHealthQuoteResult = await addHealthQuote(req.body)
      const quotation = addingHealthQuoteResult.row
  
      if (quotation){
          // add insured person
          await addInsuredPersonInfo('Health', quotation.quote_id, req.body)
          // console.log(`*** ${quotation.quote_id}  Health quotation submitted. ***`)
          res.status(200).json({
            "status":"success",
            "message": "Health Insurance quotation have been submitted successfully",
            "data": quotation.confirmation_no
            })
  
          // send confirmation email
          // get data
          const collectData = await common.getData(healthGetSql(quotation.quote_id))
          // send confirmation email
          const sendingEmailResut = await common.sendConfirmEmail('Health', collectData.data)
          // console.log(`*** ${quotation.confirmation_no}  ${sendingEmailResut.message} ***`)

      }  //if (quotation)


    } catch (err) {
      // console.log('*** Catch Error: Health Insurance quotation is not submitted. ***')
      console.error(err)
      // rollback
      res.status(400).json({
        "status":"fail",
        "message": "Health Insurance quotation is not submitted",
        "data": ''
        })
  }
})


// save health quote information 
function addHealthQuote (data) {

  return new Promise(async (resolve, reject) => {
    try{

        // console.log('health_quotes.js function: addHealthQuote ') 

        let sql = `insert into health_quote (insurance_kind, product_type, product_kind, benefit_amount, insured_person_id,
                                phone, email, contact_method, 
                                family_illness_history, age_illness, name_illness,
                                annual_income, occupation, role_work, province) 
                      values ('${data.insuranceKind}', '${data.productType}', '${data.productKind}', ${data.benefitAmount}, '${data.personID}', 
                              '${data.phone}', '${data.email}', '${data.contactMethod}',
                              '${data.familyIllnessHistory?data.familyIllnessHistory:false}', ${data.ageIllness?data.ageIllness:null}, '${data.nameIllness}',
                              ${data.annualIncome}, '${data.occupation}', '${data.roleAtWork}', '${data.province}'
                              ) returning * `
        // console.log(sql)
        await pool.query(sql)
          .then((result) => {
                if (result.rows[0].quote_id)
                {        
                  // console.log(result.rows[0].quote_id + ' quote information have been added successfully' )          
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
        // console.log('Adding health quotation information is fail  : ', err.message )
        reject(err.message)
        }
  })
}


// save insured person plan information 
function addInsuredPersonInfo (sourceType, quoteID, data) {
  return new Promise(async (resolve, reject) => {
    try{
        // console.log('health_quotes.js function: addInsuredPersonInfo ') 
        const person = data.insuredPersons

        // for
        for (const i in person) { 

          // set datetime as timezone at the moment 
          person[i].birthDate = common.momentTimeZone(person[i].birthDate, data.timeZone)

          // get insured person id
          let result =  await common.addInsuredPerson(sourceType, quoteID, person[i])
          let insuredPersonID = result.personId

          let sql = `insert into health_quote_person (health_quote_id, insured_person_id, smoke_status, health_status) 
                      values ('${quoteID}', '${insuredPersonID}', '${person[i].smokeStatus}', '${person[i].healthStatusDesc}') returning * `
          // console.log(sql)
          const insuredResult = await pool.query(sql)
          
          if (insuredResult.rowCount !== 0) {
            // console.log(insuredPersonID + ' Health insured information have been added successfully' )

            resolve({status: 200, message: 'success' })
          } else {
            reject(err.message)
          }
      
        } //for
        

      } catch (err) {
        // console.log('Adding health insured persons information is fail  : ', err.message )
        reject(err.message)
        }
  })
}


const healthSqlStatement = () => {
  let sql = `select hq.quote_id "quoteID", hq.confirmation_no "confirmationNo", hq.quote_date "quoteDate" , 
                    hq.insurance_kind "insuranceKind", 
                    (CASE hq.insurance_kind 
                            WHEN 'Critical' THEN 'Critical Illness Insurance'
                            WHEN 'Disability' THEN 'Disability Insurance' 
                            WHEN 'Personal' THEN 'Personal Insurance'
                            ELSE hq.insurance_kind END) "insuranceKindDesc", 
                    hq.product_type "productType",  
                    (CASE hq.product_type 
                            WHEN 'Term' THEN 'Term Insurance'
                            WHEN 'Permanent' THEN 'Permanent Insurance' 
                            ELSE hq.product_type END) "productTypeDesc",
                    hq.product_kind "productKind", 
                    (CASE hq.product_kind 
                            WHEN 'Term10' THEN 'Term 10'
                            WHEN 'Term20' THEN 'Term 20' 
                            WHEN 'Life' THEN 'Life Time Payment'
                            WHEN 'Life_ReturnLater15' THEN 'Life Time Payment + Return of Premium 15 years later'
                            WHEN 'Life_ReturnAt60' THEN 'Life Time Payment + Return of Premium at 65 years old'
                            ELSE hq.product_kind END) "productKindDesc", 
                    hq.benefit_amount "benefitAmount", 
                    hq.family_illness_history "familyIllnessHistory", hq.age_illness "ageIllness", 
                    hq.annual_income "annualIncome" , hq.occupation , hq.role_work "roleAtWork",
                    hq.phone , hq.email, hq.contact_method "contactMethod", hq.province,
                    (select COALESCE(json_agg( json_build_object('firstName', iperson.firstname,
                                                                    'lastName',iperson.lastname,
                                                                    'birthDate', iperson.birthdate,
                                                                    'gender',iperson.gender,
                                                                    'relationship', iperson.relationship,
                                                                    'smokeStatus', hqp.smoke_status,
                                                                    'healthStatus', hqp.health_status
                                                                  )),'[]') insuredPersons
                      from health_quote_person hqp
                      join insured_person iperson  on iperson.person_id =  hqp.insured_person_id
                      where hqp.health_quote_id = hq.quote_id
                      )
                  from health_quote hq`
  return sql
}

const healthGetSql = (id) => {
  let sql =  healthSqlStatement() + ' ' + 
              `where hq.quote_id = '${id}' `
  return sql
}


module.exports = router
module.exports.healthGetSql = healthGetSql;