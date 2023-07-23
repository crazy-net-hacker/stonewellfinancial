
require('dotenv').config()
const fetch = require('node-fetch');

  // amount Format
  function amountFormat(amount, decimal){
      return (
      parseFloat(amount).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: decimal })
      )
  }

  //access Zoho CRM
  function accessZoho(){
    return new Promise(async (resolve, reject) => {
      try{
          console.log('in accessZoho')

          let clientId = process.env.SELF_CLIENT_CAREWELL_CLIENT_ID
          let clientSecret = process.env.SELF_CLIENT_CAREWELL_CLIENT_SECRET
          let clientRefeshToken = process.env.SELF_CLIENT_CAREWELL_REFERSH_TOKEN
          
          let ApiURL = `https://accounts.zoho.com/oauth/v2/token?`
          let params = `refresh_token=${clientRefeshToken}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=refresh_token`;
          let apiURL =  `${ApiURL}${encodeURI(params)}`;

          const fetchResult = await fetch(apiURL, {method: 'POST'})
          const authResponse =  await fetchResult.json(); 

          resolve({token: authResponse.access_token})

      } catch (err) {
        reject(err)
        }
    })  
  }

  //search recodrd
  function searchRecord(parm){
    return new Promise(async (resolve, reject) => {
      try{
          // console.log('in searchRecord', parm.url)
          const got = require("got");
  
          let url = parm.url
      
          let headers = {
            'Authorization': `Zoho-oauthtoken ${parm.token}`, 
          }
      
          let parameters = parm.parameters
      
          let requestDetails = {
              method : "GET",
              headers : headers,
              // searchParams : parameters,
              query : parameters,
              throwHttpErrors : false
          }
          
          let response = await got(url, requestDetails)
    
          if(response != null && response.statusCode === 200) {
            // console.log('statusCode', response.statusCode);
            const result = JSON.parse(response.body)
            resolve({status: 200, message: "success", id: result.data[0].id })            
          }
          else{
            resolve({status: response.statusCode, message: 'No data found', id: ''})
          }
  
      } catch (err) {
        reject(err)
        }
    })  
  }

  // insert Record
  function insertRecords(parm) {
    return new Promise(async (resolve, reject) => {
      try{
          const got = require("got");
          // const token = zohoConfig.accessToken
        
          let url = parm.url
          let headers = {
            'Authorization': `Zoho-oauthtoken ${parm.token}`, 
          }
        
          let requestBody = {}
          let recordArray = parm.recordObject
          // console.log('recordArray', recordArray)
        
          requestBody['data'] = recordArray
        
          let trigger = ['approval', 'workflow', 'blueprint']
          requestBody['trigger'] = trigger
        
          let requestDetails = {
              method : "POST",
              headers : headers,
              body : JSON.stringify(requestBody),
              encoding: "utf8",
              throwHttpErrors : false
          };
          
          let response = await got(url, requestDetails)
        
          const result = JSON.parse(response.body)
          
          if(response != null) {
            // console.log('statusCode', response.statusCode);
            // console.log('message',result.data[0].message)
            // console.log('status',result.data[0].status);
            // console.log('result', result.data[0].details.id)
            resolve({status: response.statusCode, message: result.data[0].message, id: result.data[0].details.id})            
          }
          else{
            resolve({status: response.statusCode, message: result.data[0].status, id:''})
          }
  
    } catch (err) {
      reject(err.message)
      }
    })
  }

    
  // Transfer insuredpersonInfo - insert contacts To Zoho CRM
  function insertContactToZoho (token, application, personInfo) {
    return new Promise(async (resolve, reject) => {
      try{
          console.log('zoho_carwell_crm_apis.js function: insertContactToZoho ') 
          // console.log(personInfo)
          // const address = JSON.parse(application.address)
          const address = application.address
          // console.log(address)

          const recordObject = [{
                  'Account_Name': {
                    // 'name': 'Stonewell Financial',
                    'id': application.zoho_carewell_account_id //'4353263000013791156'
                  },
            
                  'First_Name': personInfo.firstName,
                  'Last_Name': personInfo.lastName,
                  'Email': application.email,
                  'Phone': application.phone,
                  "Date_of_Birth": personInfo.birthdate,
                  "Gender": personInfo.gender,
                  // "Country_of_Origin": personInfo.originCountry,
                  // "Source": 'Web Application',
                  // Mailing
                  "Mailing_Street": address.find(f=>f.useType='Mailling').street + ' #'+ address.find(f=>f.useType='Mailling').suiteNo, 
                  "Mailing_City": address.find(f=>f.useType='Mailling').city, 
                  "Mailing_State": address.find(f=>f.useType='Mailling').province,
                  "Mailing_Zip": address.find(f=>f.useType='Mailling').postalcode,
                  "Mailing_Country": address.find(f=>f.useType='Mailling').country === 'CA'?'Canada': address.find(f=>f.useType='Mailling').country, 
                  // "Send_Email_address": address.find(f=>f.useType='Mailling').isMailing,

                  // // Travel Insurance
                  // "Policy_Number": personInfo.policyNo,   
                  // "Company": personInfo.compnayName,
                  // "Product": personInfo.eligilbeIns === 'CANADIAN'? personInfo.tripType + ' Trip Plan': personInfo.eligilbeIns + ' Plan', //"Visitor Plan",   //Multi Trip Plan
                  // // "Product": person[i].planName,
                  // "Days_Option": null,
                  // "Benefit_Amount": amountFormat(personInfo.coverage,0),    
                  // "Deductible_Amount": personInfo.deductible,
                  // "Application_date": application.application_date.substr(0,10), 
                  // "Start_date": personInfo.tripStartDate,
                  // "End_Date": personInfo.tripEndDate,
                  // "Days_of_Coverage": personInfo.tripPeriod, 
                  // "Premium": personInfo.insuranceAmount,

                  // "Vendor_Phone": "416-645-3858",
                  // "Street": "4576 Yonge Street, Suite 608",
                  // "City": "North York",
                  // "State": "ON",
                  // "Zip": "M2N 6N4",
                  // "Country": "Canada",

                  //Optional Plan
                  // "Company_O": optionPlanLength > 0 ? personInfo.compnayName : null,
                  // "Application_date_O": optionPlanLength > 0 ? application.application_date.substr(0,10) : null,
                  // "Policy_Number_O": optionPlanLength > 0 ? personInfo.policyNo : null, 
                  // "AD_D":   optionPlanLength > 0 ? (personInfo.optionPlan.filter(f=>f.optionPlanType === 'ADD').length > 0 ? personInfo.optionPlan.filter(f=>f.optionPlanType === 'ADD')[0].optionPlanCoverage:null):null,
                  // "Trip_Cancelation_Interruption": null,	
                  // "Air_Flight_Accident": optionPlanLength > 0 ? (personInfo.optionPlan.filter(f=>f.optionPlanType === 'FAC').length > 0? personInfo.optionPlan.filter(f=>f.optionPlanType === 'FAC')[0].optionPlanCoverage:null):null,
                  // "Baggage": null,
                  // "Start_date_O":  optionPlanLength > 0 ? personInfo.tripStartDate : null,
                  // "End_date_O":  optionPlanLength > 0 ? personInfo.tripEndDate : null,
                  // "Days_of_Coverage_O":  optionPlanLength > 0 ? personInfo.tripPeriod : null,
                  // "Premium_O":  optionPlanPremium,

                  //sender info
                  // "Applicant_ID": personInfo.insuredPersonID,
                  // "Application_ID": application.application_id,
                  // "Profile_ID": "8617",
                  // "Client_ID": application.zoho_client_id,  // "18",
                  // "Vendor_Email": application.vendor_email,  //"info@stonewellfinancial.com",
          }]

          console.log('recordObject', recordObject)
                            

          const addContactRes = await insertRecords({
            token: token,
            url : 'https://www.zohoapis.com/crm/v2/Contacts',
            recordObject : recordObject                                  
          })                                    
          console.log(addContactRes)
          // resolve({status: 200, message: 'success', id: 4353263000066264047})
          resolve({status: 200, message: 'success', id: addContactRes.id})
          // resolve({status: 200, message: 'success'})
          
      } catch (err) {
        console.log('insertContactToZoho : ', err )
        reject(err.message)
        }
    })
  }

  //
  function updateContactToZoho (token, application, personInfo, zohoContactId, optionPlanLength, optionPlanPremium) {

    return new Promise(async (resolve, reject) => {
      try{

        // const address = JSON.parse(application.address)
        const address = application.address

        const got = require("got");
  
        let url = 'https://www.zohoapis.com/crm/v2/Contacts'
        let headers = {
          'Authorization': `Zoho-oauthtoken ${token}`
        }
    
        let requestBody = {}
        let recordArray = []
    
        let recordObject1 = {
            'id': zohoContactId,
            'Email': application.email,
            'Phone': application.phone,
            // "Country_of_Origin": personInfo.originCountry,
            // "Source": 'Web Application',
            // Mailing
            "Mailing_Street": address.find(f=>f.useType='Mailling').suiteNo + address.find(f=>f.useType='Mailling').street, //4061 kinsella way sw",
            "Mailing_Street": address.find(f=>f.useType='Mailling').street, 
            "Mailing_City": address.find(f=>f.useType='Mailling').city, 
            "Mailing_State": address.find(f=>f.useType='Mailling').province, 
            "Mailing_Zip": address.find(f=>f.useType='Mailling').postalcode,
            "Mailing_Country": address.find(f=>f.useType='Mailling').fullCountryName,
            "Send_Email_address": address.find(f=>f.useType='Mailling').isMailing,

            // Travel Insurance
            "Policy_Number": personInfo.policyNo,   
            "Company": personInfo.compnayName,
            "Product": personInfo.eligilbeIns === 'CANADIAN'? personInfo.tripType + ' Trip Plan': personInfo.eligilbeIns + ' Plan', //"Visitor Plan",   //Multi Trip Plan
            // "Product": person[i].planName,
            "Days_Option": null,
            "Benefit_Amount": amountFormat(personInfo.coverage,0),    
            "Deductible_Amount": personInfo.deductible,
            "Application_date": application.application_date.substr(0,10), 
            "Start_date": personInfo.tripStartDate,
            "End_Date": personInfo.tripEndDate,
            "Days_of_Coverage": personInfo.tripPeriod, 
            "Premium": personInfo.insuranceAmount,

            "Vendor_Phone": "416-645-3858",
            "Street": "4576 Yonge Street, Suite 608",
            "City": "North York",
            "State": "ON",
            "Zip": "M2N 6N4",
            "Country": "Canada",

            //Optional Plan
            // "Company_O": optionPlanLength > 0 ? personInfo.compnayName : null,
            // "Application_date_O": optionPlanLength > 0 ? application.application_date.substr(0,10) : null,
            // "Policy_Number_O": optionPlanLength > 0 ? personInfo.policyNo : null, 
            // "AD_D":   optionPlanLength > 0 ? (personInfo.optionPlan.filter(f=>f.optionPlanType === 'ADD').length > 0 ? personInfo.optionPlan.filter(f=>f.optionPlanType === 'ADD')[0].optionPlanCoverage:null):null,
            // "Trip_Cancelation_Interruption": null,	
            // "Air_Flight_Accident": optionPlanLength > 0 ? (personInfo.optionPlan.filter(f=>f.optionPlanType === 'FAC').length > 0? personInfo.optionPlan.filter(f=>f.optionPlanType === 'FAC')[0].optionPlanCoverage:null):null,
            // "Baggage": null,
            // "Start_date_O":  optionPlanLength > 0 ? personInfo.tripStartDate : null,
            // "End_date_O":  optionPlanLength > 0 ? personInfo.tripEndDate : null,
            // "Days_of_Coverage_O":  optionPlanLength > 0 ? personInfo.tripPeriod : null,
            // "Premium_O":  optionPlanPremium,

            //sender info
            // "Applicant_ID": personInfo.insuredPersonID,
            // "Application_ID": application.application_id,
            // "Profile_ID": "8617",
            // "Client_ID": application.zoho_client_id,  // "18",
            // "Vendor_Email": application.vendor_email,  //"info@stonewellfinancial.com",
        }
    
        recordArray.push(recordObject1)
    
        requestBody['data'] = recordArray
    
        let trigger = ['approval', 'workflow', 'blueprint']
        requestBody['trigger'] = trigger
    
        let requestDetails = {
            method : "PUT",
            headers : headers,
            body : JSON.stringify(requestBody),
            encoding: "utf8",
            throwHttpErrors : false
        };
        
        let response = await got(url, requestDetails)
        
        const result = JSON.parse(response.body)

        if(response != null) {
          // console.log('statusCode', response.statusCode);
          // console.log('message',result.data[0].message)
          // console.log('status',result.data[0].status);
          resolve({status: response.statusCode, message: result.data[0].message})            
        }
        else{
          resolve({status: response.statusCode, message: result.data[0].status})
        }
  
      } catch (err) {
        reject(err)
        }
      })
  
    }

  // Transfer plan - insert Sales_Orders To Zoho CRM
  function insertSalesToZoho (token, application, personInfo, zohoContactId, optionPlanLength, optionPlanPremium, optionPlans) {
    return new Promise(async (resolve, reject) => {
      try{
            console.log('zoho_crm_apis.js function: insertSalesToZoho ') 

            // const payment = JSON.parse(application.payment)
            const payment = application.payment

            let planRecords = []

            // get main plan product from Zoho CRM
            const serachProductRes =  await searchRecord({
                                            token : token,
                                            url : 'https://www.zohoapis.com/crm/v2/Products/search',
                                            parameters: {
                                              'criteria': `((Manufacturer:equals:${personInfo.carewellService=== 'Package'?'Package': 'Package Plus'}))`
                                            }
                                    })  
            let mainProductId = serachProductRes.id
            // let mainProductId = '4530292000004808010'

            // set Product_Details for order items
            const orderItems = [{
              "product": {"id": mainProductId },
              // "product": {"id": "4530292000004808010" },
              "quantity": personInfo.tripPeriod,
              "Discount": 0,
              "net_total": personInfo.carewellServiceAmount,
              "Tax": 0,
              "list_price": parseFloat(personInfo.carewellServiceAmount / personInfo.tripPeriod),
              }]

            // main plan
            let mainPlanRecord = {
                "Subject": '12345678',
                'Account_Name': {
                  'id': application.zoho_carewell_account_id  //'4353263000013791156'
                  // 'id': '4530292000000317588'
                },
                "Contact_Name": {
                  // "id": zohoContactId //from addContactRes 
                  // "id": '4530292000005206001' 
                  "id": zohoContactId
                },
                // "Visa_Status": personInfo.eligilbeIns === 'CANADIAN'?'Canada Residence':personInfo.eligilbeIns,
                "Language": "Korean",
                "Status": "Created",
                // "From": application.source_chnnel, //null
                //Travel Insurance
                "Policy_Number": personInfo.policyNo,
                // "Policy_Number": '',
                "Company1": personInfo.compnayName,
                // "Product": personInfo.eligilbeIns === 'CANADIAN'? personInfo.tripType + ' Trip Plan': personInfo.eligilbeIns + ' Plan', //"Visitor Plan",   //Multi Trip Plan
                "Product1": personInfo.planName,
                // "Option": optionPlans,
                // "Benefit_Amount": amountFormat(personInfo.coverage,0),
                // "Deductible_Amount": personInfo.deductible,
                "Application_Date": application.application_date.substr(0,10),
                "Effective_Date": personInfo.tripStartDate,
                "Expiry_Date": personInfo.tripEndDate,
                "Days_of_Coverage": personInfo.tripPeriod,
                // "Multi_Plan_Days": null,
                "Premium": personInfo.insuranceAmount + optionPlanPremium,
                "Payment_method": payment[0].paymentMethod==='Creditcard'?"Credit Card":"E-Transfer",
                //Carewell Plan
                "Carewell_Plan": personInfo.carewellService,
                "Start_Date": personInfo.tripStartDate,
                "End_Date": personInfo.tripEndDate,
                "Services_Duration": personInfo.tripPeriod,
                "Fee": personInfo.carewellServiceAmount,
                // "Product_C": personInfo.carewellService? personInfo.carewellService: null, //"Stonewell Visitor Package", //Carewell Plus, Carewell Premium
                // "Start_Date": personInfo.carewellService? personInfo.tripStartDate: null,
                // "Expiry_Date_C": personInfo.carewellService? personInfo.tripEndDate: null,
                // "Days_of_Service_C": personInfo.carewellService? personInfo.tripPeriod: null,
                // "Service_Fee_C": personInfo.carewellService? personInfo.carewellServiceAmount: null,
                // "Payment_Option_C": personInfo.carewellService? (payment[0].paymentMethod==='Creditcard'?"Credit Card":"E-Transfer") : null,
                // Ordered Items
                "Product_Details" : orderItems ,
                //send from
                // "Client_ID": application.zoho_client_id  //"18"
              }
              
              planRecords.push(mainPlanRecord)
              console.log(mainPlanRecord)
              console.log(orderItems)

              const addSalesRes = await insertRecords({
                                                    token : token,
                                                    url : 'https://www.zohoapis.com/crm/v2/Sales_Orders',
                                                    recordObject : planRecords                                  
                                                  })  
              console.log(addSalesRes)
              // console.log(addSalesRes.status)
              // console.log(addSalesRes.id)
              resolve({status: 200, message: 'success', id: addSalesRes.id})
              // resolve({status: 200, message: 'success'})
          
      } catch (err) {
        console.log('insertSalesToZoho  : ', err )
        reject(err.message)
        }
    })
  }


  // update Contact's companions
  function updateContactCompanionsToZoho (token, personInfo, zohoContactId) {

    return new Promise(async (resolve, reject) => {
      try{

        // console.log('zoho_crm_apis.js function: updateContactCompanionsToZoho ') 

        const got = require("got");
  
        let url = 'https://www.zohoapis.com/crm/v2/Contacts'
        let headers = {
          'Authorization': `Zoho-oauthtoken ${token}`
        }
    
        let requestBody = {}
        let recordArray = []
    
        let recordObject1 = {
            'id': zohoContactId,
            'Companion_1': personInfo.companion1,
            'Companion_2': personInfo.companion2,
            "Companion_3": personInfo.companion3,
            "Companion_4": personInfo.companion4,
            "Companion_5": personInfo.companion5
        }
    
        recordArray.push(recordObject1)
    
        requestBody['data'] = recordArray
    
        let trigger = ['approval', 'workflow', 'blueprint']
        requestBody['trigger'] = trigger
    
        let requestDetails = {
            method : "PUT",
            headers : headers,
            body : JSON.stringify(requestBody),
            encoding: "utf8",
            throwHttpErrors : false
        };
        
        let response = await got(url, requestDetails)
        
        const result = JSON.parse(response.body)

        if(response != null) {
          resolve({status: response.statusCode, message: result.data[0].message})            
        }
        else{
          resolve({status: response.statusCode, message: result.data[0].status})
        }
  
      } catch (err) {
        reject(err.message)
        }
      })
  
    }





  module.exports = { accessZoho, searchRecord, insertContactToZoho, updateContactToZoho, insertSalesToZoho, updateContactCompanionsToZoho }

