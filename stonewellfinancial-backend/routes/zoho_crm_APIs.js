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
          // console.log('in accessZoho')

          let clientId = process.env.SELF_CLIENT_CLIENT_ID
          let clientSecret = process.env.SELF_CLIENT_CLIENT_SECRET
          let clientRefeshToken = process.env.SELF_CLIENT_REFERSH_TOKEN
          
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
  function insertContactToZoho (token, application, personInfo, optionPlanLength, optionPlanPremium) {
    return new Promise(async (resolve, reject) => {
      try{
          // console.log('zoho_crm_apis.js function: insertContactToZoho ') 

          const address = JSON.parse(application.address)

          const recordObject = [{
                  'Account_Name': {'id': application.zoho_account_id },
                  'First_Name': personInfo.firstName,
                  'Last_Name': personInfo.lastName,
                  'Email': application.email,
                  'Phone': application.phone,
                  "Date_of_Birth": personInfo.birthdate,
                  "Gender": personInfo.gender,
                  "Country_of_Origin": personInfo.originCountry,
                  "Source": 'Web Application',
                  "Language": application.prefer_language,
                  // Mailing
                  "Mailing_Street": address.find(f=>f.useType='Mailling').street + (address.find(f=>f.useType='Mailling').suiteNo?' #':' ')+ address.find(f=>f.useType='Mailling').suiteNo, 
                  "Mailing_City": address.find(f=>f.useType='Mailling').city, 
                  "Mailing_State": address.find(f=>f.useType='Mailling').province,
                  "Mailing_Zip": address.find(f=>f.useType='Mailling').postalcode,
                  "Mailing_Country": address.find(f=>f.useType='Mailling').country === 'CA'?'Canada': address.find(f=>f.useType='Mailling').country, 
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
                  // "Premium": personInfo.insuranceAmount - application.familyDiscountPerPerson,
                  "Premium": parseFloat(personInfo.insuranceAmount - application.familyDiscountPerPerson).toFixed(2),

                  //Optional Plan
                  "Company_O": optionPlanLength > 0 ? personInfo.compnayName : null,
                  "Application_date_O": optionPlanLength > 0 ? application.application_date.substr(0,10) : null,
                  "Policy_Number_O": optionPlanLength > 0 ? (personInfo.optionPlanPolicyNo? personInfo.optionPlanPolicyNo : personInfo.policyNo): null, 
                  "AD_D":   optionPlanLength > 0 ? (personInfo.optionPlan.filter(f=>f.optionPlanType === 'ADD').length > 0 ? personInfo.optionPlan.filter(f=>f.optionPlanType === 'ADD')[0].optionPlanCoverage:null):null,
                  "Trip_Cancelation_Interruption": null,	
                  "Air_Flight_Accident": optionPlanLength > 0 ? (personInfo.optionPlan.filter(f=>f.optionPlanType === 'FAC').length > 0? personInfo.optionPlan.filter(f=>f.optionPlanType === 'FAC')[0].optionPlanCoverage:null):null,
                  "Baggage": null,
                  "Start_date_O":  optionPlanLength > 0 ? personInfo.tripStartDate : null,
                  "End_date_O":  optionPlanLength > 0 ? personInfo.tripEndDate : null,
                  "Days_of_Coverage_O":  optionPlanLength > 0 ? personInfo.tripPeriod : null,
                  "Premium_O":  optionPlanPremium,

                  //Tag
                  "Tag": personInfo.relationship === 'Primary'? [{"name": "Emaillist"}]:[],

                  //sender info
                  "Applicant_ID": personInfo.insuredPersonID,
                  "Application_ID": application.application_id,
                  "Client_ID": application.zoho_client_id,  // "18",
                  "Vendor_Email": application.vendor_email,  //"info@stonewellfinancial.com",
          }]

          // console.log('recordObject', recordObject)
                            

          const addContactRes = await insertRecords({
            token: token,
            url : 'https://www.zohoapis.com/crm/v2/Contacts',
            recordObject : recordObject                                  
          })                                    

          // resolve({status: 200, message: 'success', id: 4353263000066264047})
          resolve({status: 200, message: 'success', id: addContactRes.id})
          // resolve({status: 200, message: 'success'})
          
      } catch (err) {
        console.log('insertContactToZoho : ', err )
        reject(err.message)
        }
    })
  }

  // update contact info when application approved
  function updateContactToZoho (token, application, personInfo, zohoContactId, optionPlanLength, optionPlanPremium) {

    return new Promise(async (resolve, reject) => {
      try{

        const address = JSON.parse(application.address)

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
            "Country_of_Origin": personInfo.originCountry,
            "Source": 'Web Application',
            // Mailing
            "Mailing_Street": address.find(f=>f.useType='Mailling').street + (address.find(f=>f.useType='Mailling').suiteNo?' #':' ')+ address.find(f=>f.useType='Mailling').suiteNo, 
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
            // "Premium": personInfo.insuranceAmount - application.familyDiscountPerPerson,
            "Premium": parseFloat(personInfo.insuranceAmount - application.familyDiscountPerPerson).toFixed(2),

            //Optional Plan
            "Company_O": optionPlanLength > 0 ? personInfo.compnayName : null,
            "Application_date_O": optionPlanLength > 0 ? application.application_date.substr(0,10) : null,
            "Policy_Number_O": optionPlanLength > 0 ? (personInfo.optionPlanPolicyNo? personInfo.optionPlanPolicyNo : personInfo.policyNo) : null, 
            "AD_D":   optionPlanLength > 0 ? (personInfo.optionPlan.filter(f=>f.optionPlanType === 'ADD').length > 0 ? personInfo.optionPlan.filter(f=>f.optionPlanType === 'ADD')[0].optionPlanCoverage:null):null,
            "Trip_Cancelation_Interruption": null,	
            "Air_Flight_Accident": optionPlanLength > 0 ? (personInfo.optionPlan.filter(f=>f.optionPlanType === 'FAC').length > 0? personInfo.optionPlan.filter(f=>f.optionPlanType === 'FAC')[0].optionPlanCoverage:null):null,
            "Baggage": null,
            "Start_date_O":  optionPlanLength > 0 ? personInfo.tripStartDate : null,
            "End_date_O":  optionPlanLength > 0 ? personInfo.tripEndDate : null,
            "Days_of_Coverage_O":  optionPlanLength > 0 ? personInfo.tripPeriod : null,
            "Premium_O":  optionPlanPremium,
            
            //Tag
            "Tag": personInfo.relationship === 'Primary'? [{"name": "Emaillist"}]:[],

            //sender info
            "Applicant_ID": personInfo.insuredPersonID,
            "Application_ID": application.application_id,
            "Client_ID": application.zoho_client_id,  // "18",
            "Vendor_Email": application.vendor_email,  //"info@stonewellfinancial.com",
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
        reject(err.message)
        }
      })
  
  }

  
  // Transfer plan - insert Sales_Orders To Zoho CRM
  function insertSalesToZoho (token, application, personInfo, zohoContactId, optionPlanLength, optionPlanPremium, optionPlans) {
    return new Promise(async (resolve, reject) => {
      try{
            // console.log('zoho_crm_apis.js function: insertSalesToZoho ') 

            const payment = JSON.parse(application.payment)

            let planRecords = []

            // get main plan product from Zoho CRM
            const serachProductRes =  await searchRecord({
                                            token : token,
                                            url : 'https://www.zohoapis.com/crm/v2/Products/search',
                                            parameters: {
                                              'criteria': `((Manufacturer:equals:${personInfo.compnayName=== 'BlueCross'?'Blue Cross':personInfo.compnayName}) and (Type:equals:${personInfo.eligilbeIns === 'CANADIAN'? personInfo.tripType: personInfo.eligilbeIns}))`
                                            }
                                    })  
            let mainProductId = serachProductRes.id

            //optional plan
            let optionProductId = ''
            if (optionPlanLength > 0){
              // get optional plan product from Zoho CRM
              const serachOptionProdRes =  await searchRecord({
                                                  token : token,
                                                  url : 'https://www.zohoapis.com/crm/v2/Products/search',
                                                  parameters: {
                                                    'criteria': `((Manufacturer:equals:${personInfo.compnayName=== 'BlueCross'?'Blue Cross':personInfo.compnayName}) and (Type:equals:Optional))`
                                                  }
                                          })  
              optionProductId = serachOptionProdRes.id
            }

            // set optionPlans
            const optionPlans = []  

            // set Product_Details for order items
            const orderItems = [{
              "product": {"id": mainProductId },
              "quantity": personInfo.tripPeriod,
              "Discount": 0,
              // "net_total": personInfo.insuranceAmount - application.familyDiscountPerPerson,
              "net_total": parseFloat(personInfo.insuranceAmount - application.familyDiscountPerPerson),
              "Tax": 0,
              "list_price": parseFloat((personInfo.insuranceAmount - application.familyDiscountPerPerson) / personInfo.tripPeriod),
              }]

            // set optionPlans & push optional plan (orderItems)
            personInfo.optionPlan.length > 0 
              ? personInfo.optionPlan.map( option => {
                  optionPlans.push(option.optionPlanName==='Accidental Death & Dismemberment'?'AD&D':option.optionPlanName)
                  orderItems.push({
                                    "product": {"id": optionProductId },
                                    "quantity": personInfo.tripPeriod,
                                    "Discount": 0,
                                    "net_total": option.optionPlanPrice,
                                    "Tax": 0,
                                    "list_price": parseFloat(option.optionPlanPrice / personInfo.tripPeriod),
                                    "product_description" :  (option.optionPlanName==='Accidental Death & Dismemberment'?'AD&D':option.optionPlanName) 
                                                                + ' ' 
                                                                + parseFloat(isNaN(option.optionPlanCoverage) ? 0 : option.optionPlanCoverage).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0 })
                                  })
                })
              : optionPlans.push('Not Purchased');
                              

            // main plan
            let mainPlanRecord = {
                "Subject": personInfo.policyNo,
                'Account_Name': {
                  'id': application.zoho_account_id  //'4353263000013791156'
                },
                "Contact_Name": {
                  "id": zohoContactId //from addContactRes 
                },
                "Visa_Status": personInfo.eligilbeIns === 'CANADIAN'?'Canada Residence':personInfo.eligilbeIns,
                "Language": application.prefer_language,
                "From": application.source_chnnel?application.source_chnnel:'Vendor Application', //null
                //Travel Insurance
                "Policy_Number": personInfo.policyNo,
                "Company": personInfo.compnayName,
                "Product": personInfo.eligilbeIns === 'CANADIAN'? personInfo.tripType + ' Trip Plan': personInfo.eligilbeIns + ' Plan', //"Visitor Plan",   //Multi Trip Plan
                "Product": personInfo.planName,
                "Option": optionPlans,
                "Policy_Number_O": personInfo.optionPlanPolicyNo,
                "Benefit_Amount": amountFormat(personInfo.coverage,0),
                "Deductible_Amount": personInfo.deductible,
                "Destination_Country":personInfo.destCountry,
                "Destination_Province": personInfo.destProvince,
                "Arrival_Date": personInfo.arrivalDate,
                "Application_Date": application.application_date.substr(0,10),
                "Effective_Date": personInfo.tripStartDate,
                "Expiry_Date": personInfo.tripEndDate,
                "Days_of_Coverage": personInfo.tripPeriod,
                "Multi_Plan_Days": null,
                "Premium":  parseFloat((personInfo.insuranceAmount - application.familyDiscountPerPerson) + optionPlanPremium).toFixed(2),
                "Payment_Option": payment[0].paymentMethod==='Creditcard'?"Credit Card":(payment[0].paymentMethod==="Billback"?"Billback":"E-Transfer"),
                //Beneficiary
                "Beneficiary_Name": personInfo.beneficiaryName,
                "Relationship": personInfo.beneficiaryRelationship,
                //Carewell Plan
                "Policy_Number_C": personInfo.carewellPolicyNo,
                "Product_C": personInfo.carewellService? personInfo.carewellService: null, //"Stonewell Visitor Package", //Carewell Plus, Carewell Premium
                "Effective_Date_C": personInfo.carewellService? personInfo.tripStartDate: null,
                "Expiry_Date_C": personInfo.carewellService? personInfo.tripEndDate: null,
                "Days_of_Service_C": personInfo.carewellService? personInfo.tripPeriod: null,
                "Service_Fee_C": personInfo.carewellService? personInfo.carewellServiceAmount: null,
                "Payment_Option_C": personInfo.carewellService? (payment[0].paymentMethod==='Creditcard'?"Credit Card":(payment[0].paymentMethod==="Billback"?"Billback":"E-Transfer")) : null,
                // Ordered Items
                "Product_Details" : orderItems ,
                //sender info
                "Applicant_ID": personInfo.insuredPersonID,
                "Application_ID": application.application_id,
                //send from
                "Client_ID": application.zoho_client_id  //"18"
              }
              
              planRecords.push(mainPlanRecord)

              const addSalesRes = await insertRecords({
                                                    token : token,
                                                    url : 'https://www.zohoapis.com/crm/v2/Sales_Orders',
                                                    recordObject : planRecords                                  
                                                  })  
              // console.log('addSalesRes', addSalesRes)
              // console.log(addSalesRes.status)
              // console.log(addSalesRes.id)
              resolve({status: 200, message: 'success', id: addSalesRes.id})
              // resolve({status: 200, message: 'success'})
          
      } catch (err) {
        // console.log('insertSalesToZoho  : ', err )
        reject(err.message)
        }
    })
  }

  // Transfer plan - update Sales_Orders To Zoho CRM
  function updateSalesToZoho (token, application, personInfo, zohoSalesId, zohoContactId, optionPlanLength, optionPlanPremium, optionPlans) {
    return new Promise(async (resolve, reject) => {
      try{
            // console.log('zoho_crm_apis.js function: updateSalesToZoho ') 

            const got = require("got");
  
            let url = 'https://www.zohoapis.com/crm/v2/Sales_Orders'
            let headers = {
              'Authorization': `Zoho-oauthtoken ${token}`
            }
        
            let requestBody = {}
            let recordArray = []

            const payment = JSON.parse(application.payment)

            // get main plan product from Zoho CRM
            const serachProductRes =  await searchRecord({
                                            token : token,
                                            url : 'https://www.zohoapis.com/crm/v2/Products/search',
                                            parameters: {
                                              'criteria': `((Manufacturer:equals:${personInfo.compnayName=== 'BlueCross'?'Blue Cross':personInfo.compnayName}) and (Type:equals:${personInfo.eligilbeIns === 'CANADIAN'? personInfo.tripType: personInfo.eligilbeIns}))`
                                            }
                                    })  
            let mainProductId = serachProductRes.id

            //optional plan
            let optionProductId = ''
            if (optionPlanLength > 0){
              // get optional plan product from Zoho CRM
              const serachOptionProdRes =  await searchRecord({
                                                  token : token,
                                                  url : 'https://www.zohoapis.com/crm/v2/Products/search',
                                                  parameters: {
                                                    'criteria': `((Manufacturer:equals:${personInfo.compnayName=== 'BlueCross'?'Blue Cross':personInfo.compnayName}) and (Type:equals:Optional))`
                                                  }
                                          })  
              optionProductId = serachOptionProdRes.id
            }

            // set optionPlans
            const optionPlans = []  

            // set Product_Details for order items
            const orderItems = [{
              "product": {"id": mainProductId },
              "quantity": personInfo.tripPeriod,
              "Discount": 0,
              // "net_total": personInfo.insuranceAmount - application.familyDiscountPerPerson,
              "net_total": parseFloat(personInfo.insuranceAmount - application.familyDiscountPerPerson),
              "Tax": 0,
              "list_price": parseFloat((personInfo.insuranceAmount - application.familyDiscountPerPerson) / personInfo.tripPeriod),
              }]

            // set optionPlans & push optional plan (orderItems)
            personInfo.optionPlan.length > 0 
              ? personInfo.optionPlan.map( option => {
                  optionPlans.push(option.optionPlanName==='Accidental Death & Dismemberment'?'AD&D':option.optionPlanName)
                  orderItems.push({
                                    "product": {"id": optionProductId },
                                    "quantity": personInfo.tripPeriod,
                                    "Discount": 0,
                                    "net_total": option.optionPlanPrice,
                                    "Tax": 0,
                                    "list_price": parseFloat(option.optionPlanPrice / personInfo.tripPeriod),
                                    "product_description" :  (option.optionPlanName==='Accidental Death & Dismemberment'?'AD&D':option.optionPlanName) 
                                                                + ' ' 
                                                                + parseFloat(isNaN(option.optionPlanCoverage) ? 0 : option.optionPlanCoverage).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0 })
                                  })
                })
              : optionPlans.push('Not Purchased');

        
            let recordObject1 = {
                'id': zohoSalesId,
                'Account_Name': {
                  'id': application.zoho_account_id  //'4353263000013791156'
                },
                "Contact_Name": {
                  "id": zohoContactId //from addContactRes 
                },
                "Visa_Status": personInfo.eligilbeIns === 'CANADIAN'?'Canada Residence':personInfo.eligilbeIns,
                "Language": application.prefer_language,
                "From": application.source_chnnel?application.source_chnnel:'Vendor Application', //null
                //Travel Insurance
                "Policy_Number": personInfo.policyNo,
                "Company": personInfo.compnayName,
                "Product": personInfo.eligilbeIns === 'CANADIAN'? personInfo.tripType + ' Trip Plan': personInfo.eligilbeIns + ' Plan', //"Visitor Plan",   //Multi Trip Plan
                "Product": personInfo.planName,
                "Option": optionPlans,
                "Policy_Number_O": personInfo.optionPlanPolicyNo,
                "Benefit_Amount": amountFormat(personInfo.coverage,0),
                "Deductible_Amount": personInfo.deductible,
                "Destination_Country":personInfo.destCountry,
                "Destination_Province": personInfo.destProvince,
                "Arrival_Date": personInfo.arrivalDate,
                "Application_Date": application.application_date.substr(0,10),
                "Effective_Date": personInfo.tripStartDate,
                "Expiry_Date": personInfo.tripEndDate,
                "Days_of_Coverage": personInfo.tripPeriod,
                "Multi_Plan_Days": null,
                // "Premium": (personInfo.insuranceAmount - application.familyDiscountPerPerson) + optionPlanPremium,
                "Premium": parseFloat((personInfo.insuranceAmount - application.familyDiscountPerPerson) + optionPlanPremium).toFixed(2),
                "Payment_Option": payment[0].paymentMethod==='Creditcard'?"Credit Card":(payment[0].paymentMethod==="Billback"?"Billback":"E-Transfer"),
                //Beneficiary
                "Beneficiary_Name": personInfo.beneficiaryName,
                "Relationship": personInfo.beneficiaryRelationship,
                //Carewell Plan
                "Policy_Number_C": personInfo.carewellPolicyNo,
                "Product_C": personInfo.carewellService? personInfo.carewellService: null, //"Stonewell Visitor Package", //Carewell Plus, Carewell Premium
                "Effective_Date_C": personInfo.carewellService? personInfo.tripStartDate: null,
                "Expiry_Date_C": personInfo.carewellService? personInfo.tripEndDate: null,
                "Days_of_Service_C": personInfo.carewellService? personInfo.tripPeriod: null,
                "Service_Fee_C": personInfo.carewellService? personInfo.carewellServiceAmount: null,
                "Payment_Option_C": personInfo.carewellService? (payment[0].paymentMethod==='Creditcard'?"Credit Card":(payment[0].paymentMethod==="Billback"?"Billback":"E-Transfer")) : null,
                // Ordered Items
                "Product_Details" : orderItems ,
                //sender info
                "Applicant_ID": personInfo.insuredPersonID,
                "Application_ID": application.application_id,
                //send from
                "Client_ID": application.zoho_client_id  //"18"
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
        console.log('updateSalesToZoho  : ', err )
        reject(err.message)
        }
    })
  }  


  // Transfer refund - update Sales_Orders refund info To Zoho CRM
  function updateSalesRefundToZoho (token, zohoSalesId, refund) {
    return new Promise(async (resolve, reject) => {
      try{
            // console.log('zoho_crm_apis.js function: updateSalesRefundToZoho ') 

            const got = require("got");
  
            let url = 'https://www.zohoapis.com/crm/v2/Sales_Orders'
            let headers = {
              'Authorization': `Zoho-oauthtoken ${token}`
            }
        
            let requestBody = {}
            let recordArray = []
        
            let recordObject1 = {
                'id': zohoSalesId,
                //refund
                "Refund_Request_to_Provider": refund.email_date?refund.email_date.substr(0,10):null,
                "Refund_Request_from_client" : refund.request_date,
                "Reason": refund.reason,   
                "Refund_Payment_Method": refund.refund_payment_method, //지불방식, null "Credit Card" "E-transfer" "Cheque"  "Foreign transfer"              
                "Refunded": refund.refunded,
                "Refund_Amount": parseFloat(refund.refund_amount),
                "Admin_Fee": parseFloat(refund.admin_fee)>0?parseFloat(refund.admin_fee):null,
                "Discounted_Amount": parseFloat(refund.discounted_amount)>0?parseFloat(refund.discounted_amount):null,
                "Actual_amount_sent": parseFloat(refund.actual_refund_amount_sent)>0?parseFloat(refund.actual_refund_amount_sent):null,
                "Refund_Date": refund.refund_date?refund.refund_date.substr(0,10):null,
                // "E_transfer_Refund_Completed": (refund.refund_payment_method==="E-transfer" &&refund.refund_date)?refund.refund_date.substr(0,10):null,
                "E_transfer_Refund_Completed": (refund.etransfer_refund_date)?refund.etransfer_refund_date.substr(0,10):null,
                "Email_for_E_transfer": refund.etransfer_email,              
                "E_transfer_Recipient": refund.etransfer_recipient           

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
        console.log('updateSalesRefundToZoho  : ', err )
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


  // update contact email/phone/address when application updated
  function updateContactAddressToZoho (token, data, zohoContactId ) {

    return new Promise(async (resolve, reject) => {
      try{

        // console.log('updateContactAddressToZoho',data)
        const got = require("got");
  
        let url = 'https://www.zohoapis.com/crm/v2/Contacts'
        let headers = {
          'Authorization': `Zoho-oauthtoken ${token}`
        }
    
        let requestBody = {}
        let recordArray = []

        let recordObject1 = {}

        if (data.updateTarget && data.updateTarget==='address'){
            recordObject1 = {
              'id': zohoContactId,
              // Mailing
              "Mailing_Street": data.maillingInCanada?(data.mailStreetName + (data.mailUnitApartmentNo?' #':' ') + data.mailUnitApartmentNo):'', 
              "Mailing_City": data.maillingInCanada?data.mailCity:'', 
              "Mailing_State": data.maillingInCanada?data.mailProvince:'', 
              "Mailing_Zip": data.maillingInCanada?data.mailPostalCode:'',
              "Mailing_Country": data.maillingInCanada?'Canada':''
          }
          
        } else if (data.updateTarget && data.updateTarget==='contact'){
            recordObject1 = {
              'id': zohoContactId,
              'Email': data.contactEmail,
              'Phone': data.contactPhone,
            }
        
        } else if (data.updateTarget && data.updateTarget==='language'){
            recordObject1 = {
              'id': zohoContactId,
              'Language': data.preferLanguage,
            }
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
  
        resolve({status: '200', message: 'sucess'})
      } catch (err) {
        reject(err)
        }
      })
  
  }

  
  //get records
  function getRecords(parm){
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
            resolve({status: 200, message: "success", rows: result  })            
          }
          else{
            resolve({status: response.statusCode, message: 'No data found', rows: []})
          }
  
      } catch (err) {
        reject(err)
        }
    })  
  }


  module.exports = { accessZoho, searchRecord, insertContactToZoho, updateContactToZoho, insertSalesToZoho, updateSalesToZoho, 
                      updateSalesRefundToZoho,
                      updateContactCompanionsToZoho, updateContactAddressToZoho, getRecords 
                    }

