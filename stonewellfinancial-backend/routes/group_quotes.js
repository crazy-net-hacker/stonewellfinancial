require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')
const common  = require('./common')


// GET all group_quote
router.get('/', async (req, res) => {
  try {
      // console.log('group_quotes.js get /')
      let sql = groupSqlStatement()
      pool.query(sql, function (err, result) {
        if (!err) {
          return res.status(200).json({ data: result.rows })
        }
      })
  } catch (err) {
    console.error(err.message)
  }
})

// Create new group benefits quote
router.post('/add', async(req, res) => {
  try {
      console.log('group_quotes.js post /add')
      console.log('*** Group benefit quotation is submitting... ***')

      // add group quote => single data
      const addingGroupQuoteResult = await addGroupQuote(req.body)

      const quotation = addingGroupQuoteResult.row
  
      if (quotation){
          // add insured person
          await addInsuredPersonInfo('Group', quotation.group_quote_id, req.body)
          console.log(`*** ${quotation.group_quote_id}  Group benefits quotation submitted. ***`)
          res.status(200).json({
            "status":"success",
            "message": "Group benefits quotation have been submitted successfully",
            "data": quotation.confirmation_no
            })
  
          // send confirmation email
          // get data
          const collectData = await common.getData(groupGetSql(quotation.group_quote_id))
          // send confirmation email
          const sendingEmailResut = await common.sendConfirmEmail('Group', collectData.data)
          console.log(`*** ${quotation.confirmation_no}  ${sendingEmailResut.message} ***`)

      }  //if (quotation)


      } catch (err) {
        console.log('*** Catch Error: Group Benfits quotation is not submitted. ***')
        console.error(err)
        // rollback
        res.status(400).json({
          "status":"fail",
          "message": "Group Benfits quotation is not submitted",
          "data": ''
          })
    }
})



// save group quote information 
function addGroupQuote (data) {

  return new Promise(async (resolve, reject) => {
    try{

        console.log('group_quotes.js function: addGroupQuote ') 

        let longTermDisability = data.longTermDisability==='Yes' ? true:false
        let shortTermDisability = data.shortTermDisability==='Yes' ? true:false
        let criticalIllnessInsurance = data.criticalIllnessInsurance==='Yes' ? true:false
        let groupRRSPandDPSP = data.groupRRSPandDPSP==='Yes' ? true:false
        let groupTFSA = data.groupTFSA==='Yes' ? true:false

        let sql = `insert into group_quote (health_plan, dental_plan,  paramedical_plan, presciption_drug, vision_plan, 
                                            long_term_disabilty, short_term_disabilty, critical_illness_insurance, group_rrsp, group_tfsa, 
                                            company_name, business_type, phone, email, contact_method, contact_name, 
                                            business_years, employee_num, covered_employee_num, reason ) 
                      values ('${data.healthPlan}', '${data.dentalPlan}', '${data.paramedical}', '${data.prescriptionDrug}', '${data.visionPlan}',
                              ${longTermDisability}, ${shortTermDisability}, ${criticalIllnessInsurance}, ${groupRRSPandDPSP}, ${groupTFSA},
                              '${data.companyName}', '${data.natureOfBusiness}', '${data.phone}', '${data.email}', '${data.contactMethod}', '${data.contactPerson}',
                              ${data.businessYear}, ${data.numberOfFullTime}, ${data.numberOfcovered}, '${data.reasonNotSame}'
                              ) returning * `
        // console.log(sql)
        await pool.query(sql)
          .then((result) => {
                if (result.rows[0].group_quote_id)
                {        
                  console.log(result.rows[0].group_quote_id + ' quote information have been added successfully' )          
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
        console.log('Adding group quotation information is fail  : ', err.message )
        reject(err.message)
        }
  })
}


// save insured person plan information 
function addInsuredPersonInfo (sourceType, quoteID, data) {
  return new Promise(async (resolve, reject) => {
    try{
        console.log('group_quotes.js function: addInsuredPersonInfo ') 
        const person = data.insuredPersons

        // for
        for (const i in person) { 

          // set datetime as timezone at the moment 
          person[i].birthDate = common.momentTimeZone(person[i].birthDate, data.timeZone)

          // get insured person id
          let result =  await common.addInsuredPerson(sourceType, quoteID, person[i])
          let insuredPersonID = result.personId

          let sql = `insert into group_quote_person 
                      (group_quote_id, insured_person_id, covered_type, province )                
                        values ('${quoteID}', '${insuredPersonID}', '${person[i].type}', '${person[i].province}'
                          ) returning * `
          // console.log(sql)
          const insuredResult = await pool.query(sql)
          
          if (insuredResult.rowCount !== 0) {
            console.log(insuredPersonID + ' Group insured information have been added successfully' )

            resolve({status: 200, message: 'success' })
          } else {
            reject(err.message)
          }
      
        } //for
        

      } catch (err) {
        console.log('Adding group insured persons information is fail  : ', err.message )
        reject(err.message)
        }
  })
}

const groupSqlStatement = () => {
  let sql = `select group_quote_id "quoteID", confirmation_no "confirmationNo", group_quote_date "quoteDate", 
                health_plan "healthPlan", dental_plan "dentalPlan", paramedical_plan "paramedicalPlan", presciption_drug "presciptionDrug", vision_plan "visionPlan", 
                long_term_disabilty "longTermDisabilty", short_term_disabilty "ShortTermDisability", critical_illness_insurance "CriticalIllnessInsurance", group_rrsp "GroupRRSPandDPSP", group_tfsa "GroupTFSA",
                company_name "companyName", business_type "natureOfBusiness", phone, email, contact_method "contactMethod", contact_name "contactPerson", 
                business_years "businessYear", employee_num "numberOfFullTime", covered_employee_num "numberOfcovered",  reason "reasonNotSame",
                (select COALESCE(json_agg(json_build_object(
                                              'firstName', iperson.firstname,
                                              'lastName',iperson.lastname,
                                              'birthDate', iperson.birthdate,
                                              'gender',iperson.gender,
                                              'type', gqp.covered_type,
                                              'province',gqp.province
                                            )),'[]') insuredPersons
                  from group_quote_person gqp
                  join insured_person iperson  on iperson.person_id =  gqp.insured_person_id
                  where gqp.group_quote_id = gq.group_quote_id
                  )
              from group_quote gq`
  return sql
}
const groupGetSql = (id) => {
  let sql = groupSqlStatement() + ' ' +
            `where gq.group_quote_id = '${id}' `
  return sql
}


module.exports = router
module.exports.groupGetSql = groupGetSql;