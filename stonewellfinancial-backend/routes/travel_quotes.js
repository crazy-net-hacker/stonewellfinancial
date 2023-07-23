require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')
const common  = require('./common')
const zcrmAPI = require('./zoho_carewell_crm_APIs')

const multer = require('multer')
const storage = multer.memoryStorage()

const upload = multer({ storage }).fields([
  { name: 'UploadFiles', maxCount: 5 }
])
// const upload = multer({ storage })
const sendToS3 = require('../middlewares/awsS3/sendToS3')

// Update new Travel Application
router.put('/update_hold/process/application_id=:application_id', upload, async(req, res) => {
  try {
        console.log('travel_quotes.js put /update/application_id=:application_id')
        const application = req.body

        // get token to access Zoho CRM
        const accessZcrm = await zcrmAPI.accessZoho()
        console.log(accessZcrm.token)

        // const person = application.insuredpersons
        const person = JSON.parse(application.insuredpersons)
        const searchContactsRes =  await zcrmAPI.searchRecord({
          token : accessZcrm.token,
          url : 'https://www.zohoapis.com/crm/v2/Contacts/search',
          parameters: {
            // 'criteria': `((First_Name:equals:${person[i].firstName}) and (Last_Name:equals:${person[i].lastName}) and (Date_of_Birth:equals:${person[i].birthdate}))`,
            'criteria': `((First_Name:equals:${'Seokhyeon'}) and (Last_Name:equals:${'Ahn'}) and (Date_of_Birth:equals:${'2012-06-24'}))`,
          }
        })
        console.log(searchContactsRes)
        for (const i in person) { 

         const insertContactsZohoRes = await zcrmAPI.insertContactToZoho(accessZcrm.token, application,  person[i])
         
        //  const responseUpdatePolicyNo = await updatePolicyNo(req.params.application_id, person[i].insuredPersonID, person[i].policyNo)
        const insertSalesToZoho = await zcrmAPI.insertSalesToZoho(accessZcrm.token, application, person[i])

        }


        res.send({status: 200, message: 'success', row: []})

  } catch (err) {
    console.log('Error  : ', err.message )
    res.send({status: 400, message: err.message, row:[]})
  }
})

router.put('/update/process/application_id=:application_id', upload, async(req, res) => {
  try {
        // console.log('travel_applications.js put /update/application_id=:application_id')
        const application = req.body

        // update status
        // const responseUpdateProcess = await updateProcess(req.params.application_id, req.body.app_status)
        // if (responseUpdateProcess.status === 200 && req.body.app_status === 'Approved')
        // {
          // get token to access Zoho CRM
          const accessZcrm = await zcrmAPI.accessZoho()
          console.log(accessZcrm.token)
          // update policy #
          // const person = application.insuredpersons
          const person = JSON.parse(application.insuredpersons)

          for (const i in person) { 
            if (person[i].policyNo){
              const responseUpdatePolicyNo = await updatePolicyNo(req.params.application_id, person[i].insuredPersonID, person[i].policyNo)
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

                      const searchContactsRes =  await zcrmAPI.searchRecord({
                                                                    token : accessZcrm.token,
                                                                    url : 'https://www.zohoapis.com/crm/v2/Contacts/search',
                                                                    parameters: {
                                                                      'criteria': `((First_Name:equals:${person[i].firstName}) and (Last_Name:equals:${person[i].lastName}) and (Date_of_Birth:equals:${person[i].birthdate}))`,
                                                                    }
                                                                  })

                      if (searchContactsRes.id){
                        //1 contact 있으면 check existed sales order
                          person[i].zohoContactId = searchContactsRes.id
                          const searchSalesRes =  await zcrmAPI.searchRecord({
                                                                    token : accessZcrm.token,
                                                                    url : 'https://www.zohoapis.com/crm/v2/Sales_Orders/search',
                                                                    parameters: {
                                                                      'criteria': `((Contact_Name.id:equals:${searchContactsRes.id}) and (Subject:equals:${person[i].policyNo}))`
                                                                      // 'criteria': `((Contact_Name.id:equals:${searchContactsRes.id}))`

                                                                    }
                                                                  })  
                                                                
                        if (searchSalesRes.id){
                            // console.log(' Sales orders is already existed')
                        } else{
                          // 1.2 Excute transfer
                          // 1.2.1 update contacts
                          const updateContactZohoRes = await zcrmAPI.updateContactToZoho(accessZcrm.token, application, person[i], searchContactsRes.id, optionPlanLength, optionPlanPremium)
                          // console.log(updateContactZohoRes.status)

                          // 1.2.2 insert sales orders
                          if (updateContactZohoRes.status === 200){
                              // console.log('will insert contacts')
                              // console.log('searchContactsRes.id',searchContactsRes.id)
                              await zcrmAPI.insertSalesToZoho(accessZcrm.token, application, person[i], searchContactsRes.id, optionPlanLength, optionPlanPremium)
                              // console.log('result of insertSalesZoho', insertSalesZohoRes.status)
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

        //} //if (responseUpdateProcess.status === 200 && req.body.app_status === 'Approved') ... end

        res.send({status: 200, message: 'success', row: []})

  } catch (err) {
    console.log('Error  : ', err.message )
    res.send({status: 400, message: err.message, row:[]})
  }
})


// update application process status
function updateProcess (application_id, app_status) {

  return new Promise(async (resolve, reject) => {
    try{
        console.log('travel_applications.js function: updateProcess ') 

        let sql = `update application set app_status = $1
            where application_id = '${application_id}' returning *`
        let reqData = [app_status]
        const result = await pool.query(sql, reqData)
        if (result.rowCount !== 0) {
          console.log(result.rows[0].application_id + ' process status has been updated' )
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
function updatePolicyNo (application_id, insuredPersonID, policyNo) {

  return new Promise(async (resolve, reject) => {
    try{
        console.log('travel_applications.js function: updatePolicyNo ') 
        let sql = `update insured_plan set policy_number = $1
                    where application_id = '${application_id}' and insured_person_id = '${insuredPersonID}' returning *`
        let reqData = [policyNo]
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


module.exports = router