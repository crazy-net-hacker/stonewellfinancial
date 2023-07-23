require('dotenv').config()
const pool = require('../db')
const common  = require('./common')
const fetch = require('node-fetch');

  let api_key = process.env.TUGO_API_KEY
  let api_secret = process.env.TUGO_API_SECRET
  let user_name = process.env.TUGO_USER_NAME
  let password = process.env.TUGO_PASSWORD

  //access Tugo
  function accessTugo(){
    return new Promise(async (resolve, reject) => {
        try{
        //   console.log('in accessTugo')
          
          var apiURL = `https://api.tugo.com/v1/venture/accessToken`
          var headers= {
              'content-type': 'application/x-www-form-urlencoded'
          }
          var body = `client_id=${api_key}&client_secret=${api_secret}&grant_type=password&user_name=${user_name}&password=${password}`

          const fetchResult = await fetch(apiURL, {method: 'POST', headers: headers, body: body})
          const authResponse =  await fetchResult.json();
          // console.log('authResponse',authResponse)

          resolve({token: authResponse.accessToken})
  
      } catch (err) {
        reject(err)
        }
    })  
  }


  //search Product
  function searchProduct(token){
    
    return new Promise(async (resolve, reject) => {
      try{
          // console.log('in searchProduct', token)

          var apiURL = `https://api.tugo.com/v1/venture/partners/${user_name}/products`
          var headers= {
              'X-Auth-API-Key': `${api_key}`,
              'Authorization': `Bearer ${token}`,
              'content-type': 'application/json'
          }

          const fetchResult = await fetch(apiURL, {method: 'GET', headers: headers})
          const response =  await fetchResult.json();

          if(response.data &&  response.data.size > 0) {
            // const result = JSON.parse(response.data.items)
            const result = response.data.items
            resolve({status: 200, message: "success", result: result })                  
          }
          else{
            resolve({status: response.statusCode, message: 'No data found', result: []})
          }
  
      } catch (err) {
        reject(err)
        }
    })  
  }

  // search plan
  function searchPlan(palnId){
    return new Promise(async (resolve, reject) => {
      try{
        const serachSql = `select * from plan where plan_id = '${palnId}' `
            const result = await pool.query(serachSql)
            const paln = result.rowCount>0? result.rows:[];
            resolve (paln);
      } catch (err) {
        reject(err)
        }
    })  
  }

  // search plan coverages
  function searchPlanCoverage(palnId){
    return new Promise(async (resolve, reject) => {
      try{
          const serachSql = `select price_code from plan_price where plan_id = '${palnId}' group by price_code `
          const result = await pool.query(serachSql)
          const planCoverages = result.rowCount>0? result.rows:[];
          resolve (planCoverages);
      } catch (err) {
        reject(err)
        }
    })  
  }

  // search questionnaire
  function searchqQuestionnaire(questionnaireID){
    return new Promise(async (resolve, reject) => {
      try{
          const serachSql = `select * from questionnaire where questionnaire_id = '${questionnaireID}' `
          const result = await pool.query(serachSql)
          const questionnaire = result.rowCount>0? result.rows:[];
          resolve (questionnaire);
      } catch (err) {
        reject(err)
        }
    })  
  }

  //
  function setPlanQuestionnaire(insuredPerson){
    
    return new Promise(async (resolve, reject) => {
      try{
          // console.log('in getQuotes', token)

          var plans = [];
          var questionnaires = [];

          // main plan
          var mainPlan = await searchPlan(insuredPerson.planId);
          // console.log('mainPlan',mainPlan[0].deduct_code)
          var priceInputParameters = []
          // coverage sum
          var mainPlanCoveage = await searchPlanCoverage(insuredPerson.planId);
          if (mainPlanCoveage.length > 1){
              priceInputParameters.push({"code":"SUMM", "value":insuredPerson.coverage})
          }
          // deductible
          if (mainPlan[0].api_deduct_code) {
            priceInputParameters.push({"code": mainPlan[0].api_deduct_code, "value":insuredPerson.deductible})
          }
          // if multiTrip, set multiTripDays
          if (insuredPerson.eligilbeIns === 'CANADIAN' && insuredPerson.tripType==='MULTI'){
            priceInputParameters.push({"code":"TRIP", "value":insuredPerson.multiTripDays})
          }

          // main plan data
          plans.push({planCode: mainPlan[0].plan_code, priceInputParameters: priceInputParameters})


          // option plans
          if (insuredPerson.optionPlan.length>0){
            for (const o in insuredPerson.optionPlan) {
              var optionPlan = await searchPlan(insuredPerson.optionPlan[o].optionPlanId);
              // coverage sum
              var optionPlanCoveage = await searchPlanCoverage(insuredPerson.optionPlan[o].optionPlanId);

              var optionPriceInputParameters = []
              if (optionPlanCoveage.length > 1){
                optionPriceInputParameters.push({"code":"SUMM", "value":insuredPerson.optionPlan[o].coverage})
              }
              //option plans data
              plans.push({planCode: optionPlan[0].plan_code, priceInputParameters:optionPriceInputParameters})
            }
          }


          // Questionnaires
          // HEALTH_FACTOR
          if (insuredPerson.eligilbeIns === 'VISITOR'){
            questionnaires.push({code: "QU-VEQ-4",questions:[{code: "QT-VIS-2",answers: [{code: "q1a1", value: 1},{code: "q1a2",value: -1.0}]}]})
          } 
          // Medical Health Questionnair 
          if (insuredPerson.medicalAnswer && insuredPerson.medicalAnswer.length>0){
              var medicalAnswer = insuredPerson.medicalAnswer;
              var questions = [];

              // medical question & answer
              for (const m in medicalAnswer) {
                  var answer = [];
                  medicalAnswer[m].answer.map(a=>{
                    answer.push( {code: a.answer_code, value: a.answer_value===true?1:-1},)
                  })

                  questions.push({code: medicalAnswer[m].question_code.substring(1),answers:answer})
              } // end -- for (const m in medicalAnswer)
              
              // Medical Health Questionnair                
              const questionnaire = await searchqQuestionnaire(medicalAnswer[0].questionnaire_id);
              questionnaires.push({code: questionnaire[0].code.substring(1), questions:questions})

          } // end --if (insured[i].medicalAnswer && insured[i].medicalAnswer.length>0)



          resolve({mainPlan: mainPlan, plans: plans, questionnaires: questionnaires }) 
  
      } catch (err) {
        reject(err)
        }
    })  
  }


  //get qutoe
  function getQuotes(token, insured){
    
    return new Promise(async (resolve, reject) => {
      try{
          // console.log('in getQuotes', token)

          var totalPremiums = 0;
          var insuredPersons = [];

          for (const i in insured) {
            
            const premium = insured[i].insuranceAmount + insured[i].optionPlanPrice;
            totalPremiums += premium;

            var planQuestionnaires = await setPlanQuestionnaire(insured[i])
            // console.log(planQuestionnaire)

            // collection data
            insuredPersons.push({
              insuredType: insured[i].eligilbeIns,
              age: insured[i].age,
              plansToPrice: planQuestionnaires.plans,
              questionnaires: planQuestionnaires.questionnaires,
              selectedPlans: planQuestionnaires.plans
            })
          } // end -- for (const i in insured)


          var body = `{
                "productLineCode":"${planQuestionnaires.mainPlan[0].line_code}",
                "insuredType": "${insured[0].eligilbeIns}",
                "trip":{"startDate":"${insured[0].tripStartDate}", "endDate":"${insured[0].tripEndDate}", "arrivalDate":"${insured[0].arrivalDate}", "departureProvince":"${insured[0].originProvince}"}, 
                "insuredPersons":${JSON.stringify(insuredPersons)}
            }`

          // get a qutoe & check primium 
          var apiURL = `https://api.tugo.com/v1/venture/quotes/quotePrice`
          var headers= {
              'X-Auth-API-Key': `${api_key}`,
              'Authorization': `Bearer ${token}`,
              'content-type': 'application/json'
          }

          const fetchResult = await fetch(apiURL, {method: 'POST', headers: headers, body: body})

          const response =  await fetchResult.json();
          
          const result = {
              status: response.errors? 'error' : (response.messages?'error':"success"), 
              message: "Quote",
              // result: response.messages?response.messages:response.selectedPlanPrices
              result: response.errors? response.errors.messages : (response.messages?response.messages:response.selectedPlanPrices)
          }

          resolve({response: result }) 
  
      } catch (err) {
        reject(err)
        }
    })  
  }
  

  // sell Policies
  function sellPolicies(token, insured, contacts, payment){

    return new Promise(async (resolve, reject) => {
      try{
            // console.log('in sellPolicies', token)
          var insuredPersons = [];

          for (const i in insured) {

            // console.log('insured',insured)
            var planQuestionnaires = await setPlanQuestionnaire(insured[i])
            // console.log('planQuestionnaire',planQuestionnaire)
            // console.log(contacts)
            if (i === '0'){              
              insuredPersons.push({
                  insuredType: insured[i].eligilbeIns,
                  inHomeProvince: true,
                  homeProvince: insured[i].originProvince,
                  firstName: insured[i].firstName,
                  lastName: insured[i].lastName, 
                  // gender: insured[i].gender,
                  birthDate: insured[i].birthdate, 
                  beneficiaryFullName: insured[i].beneficiaryName,
                  phoneNumbers:[{"number":contacts.phoneNumbers}], 
                  addresses: contacts.mailAddress,
                  emails : [{"email": contacts.email}], 
                  questionnaires: planQuestionnaires.questionnaires,
                  selectedPlans: planQuestionnaires.plans
                })
            } else{
              insuredPersons.push({
                insuredType: insured[i].eligilbeIns,
                inHomeProvince: true,
                homeProvince: insured[i].originProvince,
                firstName: insured[i].firstName,
                lastName: insured[i].lastName, 
                // gender: insured[i].gender,
                birthDate: insured[i].birthdate, 
                beneficiaryFullName: insured[i].beneficiaryName,
                questionnaires: planQuestionnaires.questionnaires,
                selectedPlans: planQuestionnaires.plans
              })
            }
          }

          
          var body = `{
              "policyInfo":{}, 
              "trip":{"startDate":"${insured[0].tripStartDate}", 
                      "endDate":"${insured[0].tripEndDate}", 
                      "arrivalDate":"${insured[0].arrivalDate}", 
                      "departureProvince":"${insured[0].originProvince}"}, 
              "insuredPersons":${JSON.stringify(insuredPersons)},
              "payments":${JSON.stringify(payment)}
          }`

          console.log('body',body)
        
          // get a qutoe & check primium 
          var apiURL = `https://api.tugo.com/v1/venture/policies`
          var headers= {
              'X-Auth-API-Key': `${api_key}`,
              'Authorization': `Bearer ${token}`,
              'content-type': 'application/json'
          }

          const fetchResult = await fetch(apiURL, {method: 'POST', headers: headers, body: body})
          const response =  await fetchResult.json();

          const result = {
              status: response.errors? 'error' : (response.messages?'error':"success"), 
              message: 'Sell',
              result: response.errors? response.errors.messages : (response.messages?response.messages:response)
          }

        resolve({response: result }) 

      } catch (err) {
        reject(err)
      }
    })  
  }

  
  // get Policies
  function getPolicies(token, policyNumber){

    return new Promise(async (resolve, reject) => {
      try{
          //   console.log('in getPolicies', toekn)

          // get a qutoe & check primium 
          var apiURL = `https://api.tugo.com/v1/venture/policies/${policyNumber}`
          var headers= {
              'X-Auth-API-Key': `${api_key}`,
              'Authorization': `Bearer ${token}`,
              'content-type': 'application/json'
          }

          const fetchResult = await fetch(apiURL, {method: 'GET', headers: headers})

          const response =  await fetchResult.json();
          // console.log('response in getPolicies',response)

          result.push({
            status: response.errors? 'error' : (response.messages?'error':"success"), 
              message: 'Policy',
              result: response.errors? response.errors.messages : (response.messages?response.messages:response)
          })

        resolve({result: result }) 

      } catch (err) {
        reject(err)
      }
    })  
  }


module.exports = {accessTugo, searchProduct, getQuotes, sellPolicies, getPolicies  }
