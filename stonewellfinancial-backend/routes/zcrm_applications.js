require('dotenv')
const express = require('express')
const moment = require('moment')
const router = express.Router()
const pool = require('../db')
// const common  = require('./common')
const zcrmAPI = require('./zoho_crm_APIs')


router.get('/merge', async(req, res) => {
  try {
        // console.log('zoho_crm_applications.js get /merge')

        //merge ZSales To Applications
        const responseResult = await mergeZSalesToApplications()

        return res.status(200).json({
          status: responseResult.status,
          message: responseResult.message,
          date: responseResult.date?responseResult.date:'',
          to:responseResult.to?responseResult.to:''
        })
    

  } catch (err) {
    // console.log('Error  : ', err.message )
    res.send({status: 'error', message: 'Something went wrong!'})
  }
})

// merge ZSales To Applications
function mergeZSalesToApplications() {
  return new Promise(async (resolve, reject) => {
    try{
        // console.log('zoho_crm_applications.js function: merge ') 
        var rangeDate = [];

        // get token to access Zoho CRM
        const accessZcrm = await zcrmAPI.accessZoho()
        const token = accessZcrm.token
        // console.log('token',token)

        // get last Applicaion Date
        let searchSalesSql = `select max(application_date) application_date from zoho_sales_orders`
        const searchSalesRes = await pool.query(searchSalesSql)
        // reject.rows.length
        if (searchSalesRes.rowCount > 0) {
          lastApplicaionDate = searchSalesRes.rows[0].application_date
        }

        var prevDate = moment(new Date(lastApplicaionDate)).add(1, 'days');
        var nextDate = moment().subtract(1, 'days');

        // console.log('prevDate',prevDate)
        // console.log('nextDate',nextDate)

        // set rangeDate array 
        while (prevDate.isBefore(nextDate)) {
          rangeDate.push(prevDate.format('YYYY-MM-DD'));
          prevDate.add(1, 'days');
        }

        // merge
        for (const i in rangeDate) {
          // console.log(i,rangeDate[i])
          
          // 1.merge to ZohoSales (Applications)
          var salesRes =  await zcrmAPI.getRecords({
                                            token : accessZcrm.token,
                                            url : 'https://www.zohoapis.com/crm/v2/Sales_Orders/search',
                                            parameters: {
                                              'criteria': `(Application_Date:equals:${rangeDate[i]})`
                                            }
                                          })  
          if (salesRes.rows.data && parseInt(salesRes.rows.info.count) > 0){
              // console.log(`sales found : ${salesRes.rows.info.count}`)
              await mergeToZApplications(token, salesRes.rows.data)
          } 

          // Web 에서 바로 환불을 처리시, ZCRM 에 업데이트 로직 추가로 인한 더이상 실행 불필요 23/01/24
          // 2.update refund requested info if refund is requested
          // const refundRequestdRes =  await zcrmAPI.getRecords({
          //                                             token : accessZcrm.token,
          //                                             url : 'https://www.zohoapis.com/crm/v2/Sales_Orders/search',
          //                                             parameters: {
          //                                               'criteria': `(Refund_Request_from_client:equals:${rangeDate[i]})`
          //                                             }
          //                                           })  
          // if (refundRequestdRes.rows.data && parseInt(refundRequestdRes.rows.info.count) > 0){
          //     // console.log(`refundRequestdRes recoreds found : ${refundRequestdRes.rows.info.count}`)
          //     await addRefunds(token, refundRequestdRes.rows.data)
          // }

          // 3.update refund completed info if refund is completed
          // const refundCompletedRes =  await zcrmAPI.getRecords({
          //                                             token : accessZcrm.token,
          //                                             url : 'https://www.zohoapis.com/crm/v2/Sales_Orders/search',
          //                                             parameters: {
          //                                               'criteria': `(Refund_Date:equals:${rangeDate[i]})`
          //                                             }
          //                                           })  
          // if (refundCompletedRes.rows.data && parseInt(refundCompletedRes.rows.info.count) > 0){
          //     // console.log(`refundCompletedRes recoreds found : ${refundCompletedRes.rows.info.count}`)
          //     await updateRefunds(token, refundCompletedRes.rows.data)
          // }          

        
      } // for rangeDate

      if (rangeDate.length > 0){
        resolve({status: 'success', message: 'ZCRM sales (applications) merged successfully.', 
                              date: {from: moment(new Date(lastApplicaionDate)).add(1, 'days').format('YYYY-MM-DD'), to: nextDate.format('YYYY-MM-DD')}
        })
        // console.log(`ZCRM sales (applications) merged successfully.`)
      }else{
        resolve({status: 'warning', message: 'ZCRM sales (applications) already merged.'})
        // console.log('ZCRM sales (applications) already merged.')
      }         

    } catch (err) {
      // console.log(' is fail  : ', err.message )
        resolve({status: 'error', message: 'Something went wrong!'})
      }
  })
}


router.get('/merge_by_date', async(req, res) => {
  try {
        console.log('zoho_crm_applications.js get /merge_by_date?application_date=:application_date')
        console.log('req.query.application_date',req.query.application_date)

        // get token to access Zoho CRM
        const accessZcrm = await zcrmAPI.accessZoho()
        const token = accessZcrm.token
        // console.log('token',token)        

        const appliation_date = req.query.application_date //'2022-07-03'
          // 
        const applicationsRes =  await zcrmAPI.getRecords({
                                                  token : accessZcrm.token,
                                                  url : 'https://www.zohoapis.com/crm/v2/Sales_Orders/search',
                                                  parameters: {
                                                    'criteria': `(Application_Date:equals:${appliation_date})`
                                                  }
                                                })  

      if (applicationsRes.rows.data && parseInt(applicationsRes.rows.info.count) > 0){
          console.log(`Applications found : ${applicationsRes.rows.info.count}`)
          // merge to ZohoSales (Applications)
          await mergeToZApplications(token, applicationsRes.rows.data)

          res.send({status: 200, message: 'success', count: applicationsRes.rows.info.count})

      } else{
        console.log(' Applications not found')
        res.send({status: 204, message: applicationsRes.message, count: 0})
      }

      // res.send({status: 200, message: 'success', data: []})


  } catch (err) {
    console.log('Error  : ', err )
    res.send({status: 400, message: err})
  }
})




// update refund info if refund is completed
router.get('/update_zsales_by_refund_request_date', async(req, res) => {
  try {
        console.log('zoho_crm_applications.js get /update_zsales_by_refund_request_date?refund_request_date=:refund_request_date')
        // console.log('req.query.refund_request_date',req.query.refund_request_date)

        // get token to access Zoho CRM
        const accessZcrm = await zcrmAPI.accessZoho()
        const token = accessZcrm.token
        // const token = '1000.a6b8e513b348c3c948c539d46b8ff34a.b9225c674f27a333bcdc18c54b6904aa'
        console.log('token',token)

        // const token = ''
        
        const refund_request_date = req.query.refund_request_date //'2022-07-03'
        // const getReqeustDateSql = `select to_char(zso.refund_request_date,'YYYY-MM-DD') refund_request_date
        //                               from zoho_sales_orders zso 
        //                               where refund_request_date is not null
        //                               group by to_char(zso.refund_request_date,'YYYY-MM-DD') 
        //                               order by 1
        //                               `

        // const getReqeustDateRes = await pool.query(getReqeustDateSql);

        // const rangeDate = getReqeustDateRes.rows;

        // // merge
        // for (const i in rangeDate) {
        //     console.log(i,rangeDate[i].refund_request_date)
        // 
            const applicationsRes =  await zcrmAPI.getRecords({
                                                      token : token,
                                                      url : 'https://www.zohoapis.com/crm/v2/Sales_Orders/search',
                                                      parameters: {
                                                        'criteria': `(Refund_Request_from_client:equals:${refund_request_date})`
                                                        // 'criteria': `(Refund_Request_from_client:equals:${rangeDate[i].refund_request_date})`
                                                      }
                                                    })  

            if (applicationsRes.rows.data && parseInt(applicationsRes.rows.info.count) > 0){
                // console.log(`Applications found : ${applicationsRes.rows.info.count}`)
                // Update refund info to ZohoSales (Applications)
                // await updateRefundToZApplications(applicationsRes.rows.data)
                await addRefunds(token, applicationsRes.rows.data)
                // res.send({status: 200, message: 'success', count: applicationsRes.rows.info.count})

            } else{
              console.log(' Applications not found')
              // res.send({status: 204, message: applicationsRes.message, count: 0})
            }

        // } // for rangeDate

        // res.send({status: 200, message: 'success', data: applicationsRes.rows.data})
        res.send({status: 200, message: 'success'})

  } catch (err) {
    console.log('Error  : ', err )
    res.send({status: 400, message: err})
  }
})

// update refund info if refund is completed
router.get('/update_zsales_by_refund_date', async(req, res) => {
  try {
        console.log('zoho_crm_applications.js get /update_zsales_by_refund_date?refund_date=:refund_date')
        // console.log('req.query.refund_date',req.query.refund_date)

        // get token to access Zoho CRM
        const accessZcrm = await zcrmAPI.accessZoho()
        const token = accessZcrm.token
        // const token = '1000.7d3d6abe4fccccd264b1563bddb0c3d6.90d16539f430e54fdafbccf3e188a0ed'
    
        // console.log('token',token)

        // const token = ''

        
        const refund_date = req.query.refund_date //'2022-07-03'
        // const getRefundDateSql = `select to_char(zso.refund_date,'YYYY-MM-DD') refund_date
        //                               from zoho_sales_orders zso 
        //                               where refund_date is not null
        //                               group by to_char(zso.refund_date,'YYYY-MM-DD') 
        //                               order by 1
        //                               `

        // const getRefundDateRes = await pool.query(getRefundDateSql);

        // const rangeDate = getRefundDateRes.rows;

        // // merge
        // for (const i in rangeDate) {
        // console.log(i,rangeDate[i].refund_date)

        // 
        
        const refundCompletedRes =  await zcrmAPI.getRecords({
                                                  token : token,
                                                  url : 'https://www.zohoapis.com/crm/v2/Sales_Orders/search',
                                                  parameters: {
                                                    'criteria': `(Refund_Date:equals:${refund_date})`
                                                    // 'criteria': `(Refund_Date:equals:${rangeDate[i].refund_date})`
                                                  }
                                                })  
        if (refundCompletedRes.rows.data && parseInt(refundCompletedRes.rows.info.count) > 0){
          console.log(`refundCompletedRes recoreds found : ${refundCompletedRes.rows.info.count}`)
          // console.log(`Completed refund found : ${refundCompletedRes.rows.info.count}`)
          await updateRefunds(token, refundCompletedRes.rows.data)

        } else{
          console.log(' Completed refund not found')
          // res.send({status: 204, message: applicationsRes.message, count: 0})
        }
      
      // } // for rangeDate
      
        // res.send({status: 200, message: 'success', data: refundCompletedRes.rows.data})
        res.send({status: 200, message: 'success'})

  } catch (err) {
    console.log('Error  : ', err )
    res.send({status: 400, message: err})
  }
})



// merge to ZohoSales (Applications)
function mergeToZApplications (token, data) {

  return new Promise(async (resolve, reject) => {
    try{
        // console.log('zoho_crm_applications.js function: mergeToZApplications ') 
        
        for (const i in data) {

          if (data[i].Policy_Number){
            //check existed policy_no in insured_plan
            const searchInsuredPlanSql = `select policy_number 
                                            from insured_plan ip
                                          where policy_number = '${data[i].Policy_Number}'
                                          and effective_date = '${data[i].Effective_Date}'`
            const searchInsuredPlanRes = await pool.query(searchInsuredPlanSql)
            if (searchInsuredPlanRes.rowCount === 0){

              // get vendor info
              var vendorInfo = {}

              // get insured info
              var insuredPerson = {}

              if (data[i].Contact_Name){
                  const searchContactRes =  await zcrmAPI.getRecords({
                    token : token,
                    url : 'https://www.zohoapis.com/crm/v2/Contacts/search',
                    parameters: {
                      'criteria': `(id:equals:${data[i].Contact_Name.id})`
                    }
                  }) 
      
                  if (searchContactRes.rows.data && parseInt(searchContactRes.rows.info.count) > 0){
                    // console.log('searchContactRes',searchContactRes.rows.data[0].First_Name)
                    insuredPerson = searchContactRes.rows.data[0]
                  }else{
                    insuredPerson = {}
                  }

                    // get person_id
                    let searchPersonSql = `select * from insured_person_zoho
                                            where zoho_contact_id = '${insuredPerson.id}'`
                    // console.log('searchPersonSql',searchPersonSql)
                    const searchPersonRes = await pool.query(searchPersonSql)
                    // reject.rows.length
                    if (searchPersonRes.rowCount === 0) {
                      // insert if not existed
                      const insertPersonSql = `insert into insured_person_zoho
                                                      (firstname , lastname , gender , birthdate , 
                                                        zoho_contact_id , sourceby,
                                                        created_at , updated_at )
                                                values(${insuredPerson.First_Name?`'${insuredPerson.First_Name}'`:null}, ${insuredPerson.Last_Name?`'${insuredPerson.Last_Name}'`:null}, ${insuredPerson.Gender?`'${insuredPerson.Gender}'`:null}, ${insuredPerson.Date_of_Birth?`'${insuredPerson.Date_of_Birth}'`:null}, 
                                                        ${insuredPerson.id?`'${insuredPerson.id}'`:null}, 'ZCRM',
                                                        '${data[i].Created_Time}', '${data[i].Created_Time}'
                                                        ) returning * `
                      // console.log('insertPersonSql',insertPersonSql)
                      const resultInsertedPerson = await pool.query(insertPersonSql)

                      insuredPerson.person_id = resultInsertedPerson.rows[0].person_id

                    }else{
                      // if existed
                      // console.log('insuredPerson', searchPersonRes.rows[0].person_id )
                      insuredPerson.person_id = searchPersonRes.rows[0].person_id
                    }
              }   //if (data[i].Contact_Name)


                // get vendor info
                let searchVendorSql = `select * from vendor
                                        where vendor_name = '${data[i].Account_Name.name}'`
                // console.log('searchPersonSql',searchPersonSql)
                const searchVendorRes = await pool.query(searchVendorSql)
                // reject.rows.length
                if (searchVendorRes.rowCount > 0) {
                  // if existed
                  vendorInfo.vandor_id = searchVendorRes.rows[0].vendor_id
                  vendorInfo.client_id = searchVendorRes.rows[0].vendor_code
                }
                
                // insert
                const salesId = 'zcrm_'+data[i].id

                // console.log('salesId',salesId)
                // console.log('data[i].Contact_Name',data[i].Contact_Name)

                let insertSql = `insert into zoho_sales_orders 
                                    (zoho_sales_id, travel_purpose, prefer_language, from_source, renewed, reason_not_renew, canceled_date,
                                      insurance_company, product, benefit_amount, deductible_amount, application_date, origin_country, 
                                      effective_date, expiry_date, coverage_days, premium, payment_method, carewell_product, carewell_service_fee, 
                                      policy, vendor_id, vendor_name, client_id, 
                                      contact_id, person_id, firstname, lastname, birthdate, email, phone,
                                      street, city, province, postalcode, country, created_at, updated_at
                                    )
                                    values 
                                    ('${salesId}', ${data[i].Visa_Status?`'${data[i].Visa_Status}'`:null}, ${data[i].Language?`'${data[i].Language}'`:null}, ${data[i].From?`'${data[i].From}'`:null}, ${data[i].Renewed}, ${data[i].Reason_not_renew?`'${data[i].Reason_not_renew}'`:null}, ${data[i].Canceled_Date?`'${data[i].Canceled_Date}'`:null},
                                      ${data[i].Company?`'${data[i].Company}'`:null}, ${data[i].Product?`'${data[i].Product}'`:null}, ${data[i].Benefit_Amount?`'${data[i].Benefit_Amount}'`:null}, ${data[i].Deductible_Amount?`'${data[i].Deductible_Amount}'`:null}, ${data[i].Application_Date?`'${data[i].Application_Date}'`:null}, null, 
                                      ${data[i].Effective_Date?`'${data[i].Effective_Date}'`:null}, ${data[i].Expiry_Date?`'${data[i].Expiry_Date}'`:null}, ${data[i].Days_of_Coverage}, ${data[i].Premium}, ${data[i].Payment_Option?`'${data[i].Payment_Option}'`:null}, ${data[i].Product_C?`'${data[i].Product_C}'`:null}, ${data[i].Service_Fee_C}, 
                                      ${data[i].Policy_Number?`'${data[i].Policy_Number}'`:null}, ${vendorInfo.vandor_id?`'${vendorInfo.vandor_id}'`:null}, ${data[i].Account_Name.name?`'${data[i].Account_Name.name}'`:null}, ${vendorInfo.client_id?`'${vendorInfo.client_id}'`:null}, 
                                      ${data[i].Contact_Name && data[i].Contact_Name.id?`'${data[i].Contact_Name.id}'`:null}, ${insuredPerson.person_id?`'${insuredPerson.person_id}'`:null}, ${insuredPerson.First_Name?`'${insuredPerson.First_Name}'`:null}, ${insuredPerson.Last_Name?`'${insuredPerson.Last_Name}'`:null}, ${insuredPerson.Date_of_Birth?`'${insuredPerson.Date_of_Birth}'`:null}, ${insuredPerson.Email?`'${insuredPerson.Email}'`:null}, ${insuredPerson.Phone?`'${insuredPerson.Phone}'`:null}, 
                                      ${insuredPerson.Mailing_Street?`'${insuredPerson.Mailing_Street.replace("'",'')}'`:null}, ${insuredPerson.Mailing_City?`'${insuredPerson.Mailing_City.replace("'",'')}'`:null}, ${insuredPerson.Mailing_State?`'${insuredPerson.Mailing_State}'`:null}, ${insuredPerson.Mailing_Zip?`'${insuredPerson.Mailing_Zip}'`:null}, ${insuredPerson.Country?`'${insuredPerson.Country}'`:null}, '${data[i].Created_Time}', '${data[i].Created_Time}'
                                    ) returning * `
                      
                // console.log('insertSql',insertSql)
                await pool.query(insertSql)

            } //end if (searchInsuredPlanRes.rowCount === 0)
          } //end if (data[i].Policy_Number)

        } //for loop

        resolve({status: 200, message: 'success'})


    } catch (err) {
      // console.log(' is fail  : ', err.message )
      reject(err.message)
      }
  })
}


// Update to ZohoSales (Applications)
function updateRefundToZApplications (data) {

  return new Promise(async (resolve, reject) => {
    try{
        // console.log('zoho_crm_applications.js function: updateRefundToZApplications ') 
        
        for (const i in data) {

              // check existed records
              let searchSalesSql = `select * from zoho_sales_orders
                                      where zoho_sales_id = 'zcrm_${data[i].id}'`
              const searchSalesRes = await pool.query(searchSalesSql)
              if (searchSalesRes.rowCount > 0) {
                // update if existed
                const updateSalesSql = `update zoho_sales_orders
                                          Set refund_request_date = $1,
                                              refund_reason = $2 , 
                                              refunded = $3 ,
                                              refund_date = $4,
                                              refund_amount = $5
                                        where zoho_sales_id = 'zcrm_${data[i].id}'`
                const reqData = [
                  data[i].Refund_Request_from_client, //$1
                  data[i].Reason, //$2
                  data[i].Refunded, //$3
                  data[i].Refund_Date, //$4
                  data[i].Refund_Amount //$5
                ]
                // console.log(reqData)
                await pool.query(updateSalesSql, reqData)
              }
        
        } //for loop

        resolve({status: 200, message: 'success'})


    } catch (err) {
      console.log(' is fail  : ', err.message )
      reject(err.message)
      }
  })
}


// add refund 
function addRefunds (token, data) {

  return new Promise(async (resolve, reject) => {
    try{
        // console.log('zoho_crm_applications.js function: addRefunds ') 
        

        for (const i in data) {
          // console.log('data',data)
          var z_sales_id = '', z_person_id = '', z_vendor_id= '', 
              application_id = '', person_id = '', insurance_type = '', vendor_id = ''

          // get info
          let searchZSalesSql = `select zoho_sales_id, person_id, firstname, lastname, to_char(birthdate,'YYYY-MM-DD') birthdate, email, vendor_id 
                                        from zoho_sales_orders
                                  where zoho_sales_id = 'zcrm_${data[i].id}'`
          const searchZSalesRes = await pool.query(searchZSalesSql)
          if (searchZSalesRes.rowCount > 0) {
            // if existed
            z_sales_id = searchZSalesRes.rows[0].zoho_sales_id
            z_person_id = searchZSalesRes.rows[0].person_id,
            z_vendor_id = searchZSalesRes.rows[0].vendor_id
            z_firstname = searchZSalesRes.rows[0].firstname
            z_lastname = searchZSalesRes.rows[0].lastname
            z_birthdate = searchZSalesRes.rows[0].birthdate
            z_email = searchZSalesRes.rows[0].email
          }else{
            //
            const searchContactRes =  await zcrmAPI.getRecords({
                token : token,
                url : 'https://www.zohoapis.com/crm/v2/Contacts/search',
                parameters: {
                  'criteria': `(id:equals:${data[i].Contact_Name.id})`
                }
              }) 
              if (searchContactRes.rows.data && parseInt(searchContactRes.rows.info.count) > 0){
                z_firstname = searchContactRes.rows.data[0].First_Name
                z_lastname = searchContactRes.rows.data[0].Last_Name
                z_birthdate = searchContactRes.rows.data[0].Date_of_Birth
                z_email = searchContactRes.rows.data[0].email
              }
          }
          // console.log( 'z_firstname,  z_lastname, z_birthdate', z_firstname,  z_lastname, z_birthdate)

          const searchInsuredPlanSql = `select a.vendor_id, i.*, p.*
                                          from insured_plan i
                                          join insured_person p 
                                            on p.person_id = i.insured_person_id 
                                            and lower(replace(p.firstname, ' ', '')) = lower(replace('${z_firstname}', ' ', ''))
                                            and lower(replace(p.lastname, ' ', '')) = lower(replace('${z_lastname}', ' ', ''))
                                          join application a on a.application_id = i.application_id
                                        where policy_number = '${data[i].Policy_Number}'
                                        and effective_date = '${data[i].Effective_Date}'
                                        `
          // console.log('searchInsuredPlanSql',searchInsuredPlanSql)
          const searchInsuredPlanRes = await pool.query(searchInsuredPlanSql)
          // console.log('searchInsuredPlanRes',searchInsuredPlanRes.rowCount)
          if (searchInsuredPlanRes.rowCount > 0) {
            // if existed
            // console.log('searchInsuredPlanRes',searchInsuredPlanRes.rowCount)
            application_id = searchInsuredPlanRes.rows[0].application_id
            person_id = searchInsuredPlanRes.rows[0].person_id
            insurance_type = searchInsuredPlanRes.rows[0].eligible_insured_type
            vendor_id = searchInsuredPlanRes.rows[0].vendor_id
          }

          // check if existed records
          const searchRefundSql = `select * from insured_refund r
                                      where policy_number = '${data[i].Policy_Number}'
                                      and effective_date = '${data[i].Effective_Date}'
                                      and lower(replace(r.firstname, ' ', '')) = lower(replace('${z_firstname}', ' ', ''))
                                      and lower(replace(r.lastname, ' ', '')) = lower(replace('${z_lastname}', ' ', ''))
                                    `
          // console.log('searchRefundSql',searchRefundSql)
          const searchRefundRes = await pool.query(searchRefundSql)
          // console.log('searchRefundRes',searchRefundRes.rowCount)
          // insert if not existed
          if (searchRefundRes.rowCount === 0){
              const insertSql = `insert into insured_refund
                                      (request_date, source_from, vendor_id, application_id, insured_person_id, firstname, lastname, birthdate, email,
                                        insurance_company , insurance_type, policy_number, effective_date , reason, email_provider , email_date , 
                                        refunded, refund_date, refund_amount, 
                                        refund_payment_method,admin_fee, discounted_amount, actual_refund_amount_sent,
                                        etransfer_refund_date,
                                        etransfer_email,
                                        etransfer_recipient,
                                        status             
                                      )
                                    values
                                      (${data[i].Refund_Request_from_client?`'${data[i].Refund_Request_from_client}'`:null}, 'Z', '${z_vendor_id?z_vendor_id:vendor_id}', '${application_id?application_id:z_sales_id}', '${application_id?person_id:z_person_id}', '${z_firstname}', '${z_lastname}', '${z_birthdate}', '${z_email}',
                                        '${data[i].Company}', '${application_id?insurance_type:data[i].Product.slice(0,30)}', '${data[i].Policy_Number}', ${data[i].Effective_Date?`'${data[i].Effective_Date}'`:null}, '${data[i].Reason}', ${data[i].Refund_Request_to_Provider?true:false}, ${data[i].Refund_Request_to_Provider?`'${data[i].Refund_Request_to_Provider}'`:null}, 
                                        ${data[i].Refunded?`'${data[i].Refunded}'`:null}, 
                                        ${data[i].Refund_Date?`'${data[i].Refund_Date}'`:null}, ${data[i].Refund_Amount}, 
                                        ${data[i].Refund_Payment_Method?`'${data[i].Refund_Payment_Method}'`:null},${data[i].Admin_Fee}, ${data[i].Discounted_Amount},${data[i].Actual_amount_sent}, 
                                        ${data[i].E_transfer_Refund_Completed?`'${data[i].E_transfer_Refund_Completed}'`:null},
                                        ${data[i].Email_for_E_transfer?`${data[i].Email_for_E_transfer}`:null},
                                        ${data[i].E_transfer_Recipient?`${data[i].E_transfer_Recipient}`:null},
                                        '${data[i].Refunded?(data[i].Refunded==='Rejected'?data[i].Refunded:'Refunded'):'Requested'}'
                                      )
                                  `
              await pool.query(insertSql)
        
          } // insert if not existed

        } //for loop

        resolve({status: 200, message: 'success'})


    } catch (err) {
      console.log('addRefunds is fail  : ', err.message )
      reject(err.message)
      }
  })
}


// Update refund
function updateRefunds (token, data) {

  return new Promise(async (resolve, reject) => {
    try{
        // console.log('zoho_crm_applications.js function: updateRefund ') 
        
        for (const i in data) {

              var firstname = '', lastname = '';

              // check existed records
              let searchSalesSql = `select firstname, lastname, policy, effective_date
                                      from zoho_sales_orders
                                      where zoho_sales_id = 'zcrm_${data[i].id}'`
              const searchSalesRes = await pool.query(searchSalesSql)
              if (searchSalesRes.rowCount > 0) {
                  // console.log(searchSalesRes.rows[0].firstname)
                  firstname = searchSalesRes.rows[0].firstname;
                  lastname = searchSalesRes.rows[0].lastname;
              }else{
                //
                const searchContactRes =  await zcrmAPI.getRecords({
                    token : token,
                    url : 'https://www.zohoapis.com/crm/v2/Contacts/search',
                    parameters: {
                      'criteria': `(id:equals:${data[i].Contact_Name.id})`
                    }
                  }) 
                  if (searchContactRes.rows.data && parseInt(searchContactRes.rows.info.count) > 0){
                    firstname = searchContactRes.rows.data[0].First_Name
                    lastname = searchContactRes.rows.data[0].Last_Name
                  }
              }

              if (firstname && lastname){
                // update if existed
                const updateRefundSql = `update insured_refund
                                          set email_provider = $1,
                                              email_date = $2,
                                              refunded = $3,
                                              refund_date = $4,
                                              refund_amount = $5,
                                              refund_payment_method = $6,
                                              admin_fee = $7,
                                              discounted_amount = $8,
                                              actual_refund_amount_sent = $9,
                                              etransfer_refund_date = $10,
                                              etransfer_email = $11,
                                              etransfer_recipient = $12,
                                              status = $13
                                        where policy_number = '${data[i].Policy_Number}'
                                        and effective_date = '${data[i].Effective_Date}'
                                        and lower(replace(firstname, ' ', '')) = lower(replace('${firstname}', ' ', ''))
                                        and lower(replace(lastname, ' ', '')) = lower(replace('${lastname}', ' ', ''))
                                        and refund_date is null
                                        `
                const reqData = [
                  true,  //$1
                  data[i].Refund_Request_to_Provider, //$2
                  data[i].Refunded, //$3
                  data[i].Refund_Date, //$4
                  data[i].Refund_Amount, //$5
                  data[i].Refund_Payment_Method, //$6
                  data[i].Admin_Fee, //$7
                  data[i].Discounted_Amount, //$8
                  data[i].Actual_amount_sent, //$9
                  data[i].E_transfer_Refund_Completed, //$10
                  data[i].Email_for_E_transfer, //$11
                  data[i].E_transfer_Recipient, //$12
                  data[i].Refunded==='Rejected'?'Rejected':'Refunded'
                ]
                // console.log(reqData)
                await pool.query(updateRefundSql, reqData)
              }
        
        } //for loop

        resolve({status: 200, message: 'success'})


    } catch (err) {
      console.log('updateRefunds is fail  : ', err.message )
      reject(err.message)
      }
  })
}




module.exports = router
module.exports.mergeZSalesToApplications = mergeZSalesToApplications;
