const pool = require('../db')
const mailer = require('../middlewares/emailService/mailer')
const emailLetter = require('../middlewares/emailService/templates/emailLetter')
const applicationApprovedNotice = require('../middlewares/emailService/templates/applicationApprovedNotice')
const directPaymentRequest = require('../middlewares/emailService/templates/directPaymentRequest')
const sendToS3 = require('../middlewares/awsS3/sendToS3')

const moment = require('moment-timezone');
//
const trans_en = require('../middlewares/emailService/translation/languages/en.json')
const trans_fr = require('../middlewares/emailService/translation/languages/fr.json')
const trans_ko = require('../middlewares/emailService/translation/languages/ko.json')
const trans_ar = require('../middlewares/emailService/translation/languages/ar.json')
const trans_yue = require('../middlewares/emailService/translation/languages/yue.json')
const trans_ch_s = require('../middlewares/emailService/translation/languages/ch_s.json')
const trans_ch_t = require('../middlewares/emailService/translation/languages/ch_t.json')
const trans_de = require('../middlewares/emailService/translation/languages/de.json')
const trans_es = require('../middlewares/emailService/translation/languages/es.json')
const trans_fa = require('../middlewares/emailService/translation/languages/fa.json')
const trans_ja = require('../middlewares/emailService/translation/languages/ja.json')
const trans_pt_br = require('../middlewares/emailService/translation/languages/pt_br.json')
const trans_vi = require('../middlewares/emailService/translation/languages/vi.json')


  // search insured person
  function searchInsuredPerson (data) {
    // var elibigleInsurance = ''
    return new Promise(async (resolve, reject) => {
      try {
        // console.log('common_routes.js function: searchInsuredPerson') 
        
        // check existed insured personal information
        const sql = `select * 
                      from insured_person 
                      where firstname = '${data.firstName}'
                      and lastname = '${data.lastName}'
                      and birthDate = '${data.birthDate}'
                      `
        // console.log(sql)
        await pool.query(sql)
        .then((result) => {
              resolve({status: 200, message: 'success', personId: result.rowCount !== 0? result.rows[0].person_id: '' })
          }).catch((err) => { reject(err.message)})
  
      } catch (err) {
        reject(err.message)
    }
  
    })
  }


  // insert insured person
  function addInsuredPerson (sourceType, sourceID, data) {
    // var elibigleInsurance = ''
    return new Promise(async (resolve, reject) => {
      try {
        // console.log('common_routes.js function: addInsuredPerson') 
        // console.log(req.params.source)
        // let reqData = req.body
  
        // check existed insured personal information
        const sql = 'select * FROM insured_person where firstname = $1 and lastname = $2 and birthDate = $3'
        // const insuredResult = await pool.query(sql, [data.firstName, data.lastName, momentTimeZone(data,timeZone)])
        const insuredResult = await pool.query(sql, [data.firstName, data.lastName, data.birthDate])
        if (insuredResult.rowCount !== 0) {     
            // console.log(insuredResult.rows[0].person_id)
            resolve({status: 200, message: 'success', personId: insuredResult.rows[0].person_id })
          } 
        // add if not existed insured
        else 
        {
          let sql = `insert into insured_person (firstname, lastname, gender, birthDate, relationship, 
                      phone, email, sourceby ) 
            values ('${data.firstName}', '${data.lastName}', '${data.gender}', '${data.birthDate}', '${data.relationship}',
                    '${data.phone?data.phone:''}', '${data.email?data.email:''}', '${sourceType}') returning person_id `
          await pool.query(sql)
          .then((result) => {
                // console.log('Insured(person) has been added successfully' )
                // console.log(result.rows[0].person_id)
                // resolve(result.rows[0].person_id)
                resolve({status: 200, message: 'success', personId: result.rows[0].person_id })
            }).catch((err) => { reject(err.message)})
      }
  
      } catch (err) {
        reject(err.message)
    }
  
    })
  }


  // address crud decision
  function addressInfo (source, sourceID, address) {

    return new Promise(async (resolve, reject) => {
      try{
        // console.log('common_routes.js function: addressInfo ') 

            const searchSql = `select * 
                        from address  
                        where source_type = '${source}'
                          and source_id = '${sourceID}'
                          and use_type = '${address.useType}'`
            const searchResult = await pool.query(searchSql)
            
            let addressResult = ''

            // add
            if (searchResult.rowCount === 0) {
                // addAddressInfo(source, sourceID, address)
                const sql = `insert into address ( source_type, source_id,  address_type, 
                                                    street, suite_no, city, province, postalcode, country, 
                                                    use_type, is_mailing ) 
                                            values ('${source}', '${sourceID}', '${address.addressType}',
                                                    '${address.street}', '${address.suiteNo}', '${address.city}', '${address.province}', '${address.postalcode}', '${address.country}', 
                                                    '${address.useType}', ${address.isMailing}
                                                  ) returning * `
                addressResult = await pool.query(sql)
            }
            // update
            else{
                  const sql = `update address 
                                  set street = $1,
                                      suite_no = $2, 
                                      city = $3, 
                                      province = $4,
                                      postalcode = $5
                                where source_type = '${source}'
                                  and source_id = '${sourceID}'
                                  and use_type = '${address.useType}' returning *`
                  const reqData = [address.street, address.suiteNo, address.city, address.province, address.postalcode ]

                  addressResult = await pool.query(sql, reqData)
            }

            if (addressResult.rowCount !== 0) {
              // console.log(sourceID + ' address information have been added successfully' )
              resolve({status: 200, message: 'success'})
            }else{
              reject('error')
            }
  
        } catch (err) {
          console.log('Handling addressInfo  is fail  : ', err.message )
          reject(err.message)
          }
    })
  }
  
  // insert address information
  function addAddressInfo (source, sourceID, address) {

    return new Promise(async (resolve, reject) => {
      try{
        // console.log('common_routes.js function: addAddressInfo ') 

          let sql = `insert into address ( source_type, source_id,  address_type, 
                          street, suite_no, city, province, postalcode, country, 
                          use_type, is_mailing ) 
            values ('${source}', '${sourceID}', '${address.addressType}',
                    '${address.street}', '${address.suiteNo}', '${address.city}', '${address.province}', '${address.postalcode}', '${address.country}', 
                    '${address.useType}', ${address.isMailing}
                  ) returning * `

            const addressResult = await pool.query(sql)
            if (addressResult.rowCount !== 0) {
              // console.log(sourceID + ' address information have been added successfully' )
              resolve({status: 200, message: 'success'})
            }else{
              reject(err.message)
            }

          // resolve()
  
        } catch (err) {
          console.log('Adding address information is fail  : ', err.message )
          reject(err.message)
          }
    })
  }

  // update address information
  function updateAddressInfo (source, sourceID, address) {

    return new Promise(async (resolve, reject) => {
      try{
          // console.log('common_routes.js function: updateAddressInfo ') 

          // update address
          const sql = `update address 
                        set street = $1,
                            suite_no = $2, 
                            city = $3, 
                            province = $4,
                            postalcode = $5
                      where source_type = '${source}'
                        and source_id = '${sourceID}'
                        and use_type = '${address.useType}' returning *`
          reqData = [address.street, address.suiteNo, address.city, address.province, address.postalcode ]

          await pool.query(sql, reqData)
            .then((result) => {
                  if (result.rows){
                      resolve({status: 200, message: 'success' })
                  }
              })
            .catch((err) => {reject(err.message)})     
    
        } catch (err) {
          console.log('updating address information is fail  : ', err.message )
          reject(err.message)
          }
    })
  }

  // delete address information
  function deleteAddressInfo (source, sourceID, useType) {

    return new Promise(async (resolve, reject) => {
      try{
          // console.log('common_routes.js function: deleteAddressInfo ') 

          // update address
          sql = `delete from address 
                  where source_type = '${source}'
                  and source_id = '${sourceID}'
                  and use_type = '${useType}' returning *`

          await pool.query(sql)
            .then((result) => {
                  if (result.rows){
                      resolve({status: 200, message: 'success' })
                  }
              })
            .catch((err) => {reject(err.message)})     
    
        } catch (err) {
          console.log('Deliting address information is fail  : ', err.message )
          reject(err.message)
          }
    })
  }
  

  // insert payment information
  function addPaymentInfo (sourceID, payment) {

    return new Promise(async (resolve, reject) => {
      try{
        // console.log('common_routes.js function: addPaymentInfo ') 

        let sql = `insert into payment ( application_id, payee_id, amount,
                    transaction_type, transaction_date, payment_method, payment_status, sender_name,
                    creditcard_type, creditcard_number, card_holder, card_cvv, card_expired ) 
                      values ('${sourceID}', '${payment.payeeId}', ${payment.amount},
                      '${payment.transactionType}', ${payment.transactionDate}, '${payment.paymentMethod}', '${payment.paymentStatus}', '${payment.senderName}', 
                      '${payment.creditCardType}','${payment.creditCardNumber.replace(/\s+/g, '')}','${payment.cardHolderName}','${payment.cardcvv}','${payment.cardExpired}'
                      ) returning * `
          // console.log(sql)
          const paymentResult = await pool.query(sql)
          if (paymentResult.rowCount !== 0) {
            // console.log(sourceID + ' payment information have been added successfully' )
            resolve({status: 200, message: 'success'})
          } else{
            reject(err.message)
          }

  
        } catch (err) {
          console.log('Adding payment information is fail  : ', err.message )
          // reject({status: 500, message: err})
          reject(err.message)
          }
    })
  }

  // update payment information
  function updatePaymentInfo (sourceID, payment) {

    return new Promise(async (resolve, reject) => {
      try{
          // console.log('common_routes.js function: updatePaymentInfo ') 
          // update address
          sql = `update payment 
                set amount = $1,
                    transaction_type = $2, 
                    transaction_date = $3, 
                    payment_method = $4, 
                    payment_status = $5, 
                    sender_name = $6,
                    creditcard_type = $7, 
                    creditcard_number = $8, 
                    card_holder = $9, 
                    card_cvv = $10, 
                    card_expired = $11,
                    payee_id = $12
              where application_id = '${sourceID}'
                and payment_seq = 1 returning *`
          
          reqData = [parseFloat(payment.amount), payment.transactionType, payment.transactionDate, payment.paymentMethod, 
                      payment.paymentStatus, payment.senderName,
                      payment.creditCardType, payment.creditCardNumber.replace(/\s+/g, ''), payment.cardHolderName, payment.cardcvv, payment.cardExpired,
                      payment.payeeId
                    ]
          
          await pool.query(sql, reqData)
            .then((result) => {
                  if (result.rows){
                      resolve({status: 200, message: 'success' })
                  }
              })
            .catch((err) => {reject({status: 400, message: err.message})})    
    
        } catch (err) {
          console.log('updating payment information is fail  : ', err.message )
          reject(err.message)
          }
    })
  }


  // send confirmation Email
  function sendConfirmEmail (source, data) {

    /* translte to language
      en: 'English',
      fr: 'French',
      ko: 'Korean',
      ar: 'Arabic',
      yue: 'Cantonese',
      ch_s: 'Chinese(Simplified)',
      ch_t: 'Chinese(Traditional)',
      de: 'German',
      es: 'Spanish',
      fa: 'Persian',
      ja: 'Japanese',
      pt_br: 'Portuguese(Brazil)',
      vi: 'Vietnamese'
    */
    const translation = [
      {language: 'en', translate: trans_en, sort_order: 99},
      {language: 'fr', translate: trans_fr, sort_order: 1},
      {language: 'ko', translate: trans_ko, sort_order: 2}, 
      {language: 'ar', translate: trans_ar, sort_order: 3}, 
      {language: 'yue', translate: trans_yue, sort_order: 4}, 
      {language: 'ch_s', translate: trans_ch_s, sort_order: 5}, 
      {language: 'ch_t', translate: trans_ch_t, sort_order: 6}, 
      {language: 'de', translate: trans_de, sort_order: 7}, 
      {language: 'es', translate: trans_es, sort_order: 8}, 
      {language: 'fa', translate: trans_fa, sort_order: 9}, 
      {language: 'ja', translate: trans_ja, sort_order: 10}, 
      {language: 'pt_br', translate: trans_pt_br, sort_order: 11}, 
      {language: 'vi', translate: trans_vi, sort_order: 12}, 
    ]

    let trans = {};
    if (translation.filter(f=>f.language === (data.prefer_language?data.prefer_language:'en')).length>0){
      trans = translation.filter(f=>f.language === (data.prefer_language?data.prefer_language:'en'))[0].translate
    }else{
      trans = trans_en;
    }; 

    return new Promise(async (resolve, reject) => {
      try{
        
        if (source !== 'Approved'){
          // send email to client 
          var mailOptions = await emailLetter.letterMailOptions(source, data, trans)
          await mailer.sendEmail(mailOptions)

          // send a reqeust online payment email if a client reqesuts direct payment
          if (source === 'Travel' && data.payment && data.payment[0].PaymentBy === 'Client'){
            var paymentMailOptions = await directPaymentRequest.letterMailOptions(data, trans)
            await mailer.sendEmail(paymentMailOptions)
          } 

        } else{
          // send approved notice email to vendor when source is Approved 
          var sendEmailToVendor = data.sendEmailToVendor?data.sendEmailToVendor:false
          
          // send applicationApprovedNotice to vendor if sendEmailToVendor is ture
          if (sendEmailToVendor === true){
            var noticeMailOptions = await applicationApprovedNotice.letterMailOptions(data)
            await mailer.sendEmail(noticeMailOptions)
          }
          
          // send to client if vendor allows email to client
          if (data.allow_email_client && data.allow_email_client === true){
            // prepare attache files
            const files = []
            const attachmentList = []

            // group by policies (policy numbers of main plan, option plan and carewell)
            const policies = [] 
            data.insuredpersons.map(i=> i.policyNo?policies.push(i.policyNo+'.pdf'):null)
            data.insuredpersons.filter(f=>f.optionPlanPolicyNo).map(i=> policies.push(i.optionPlanPolicyNo+'.pdf'))
            data.insuredpersons.filter(f=>f.carewellPolicyNo).map(i=> policies.push(i.carewellPolicyNo+'.pdf'))
            const uniquePolicies = Array.from(new Set(policies))
            
            if (uniquePolicies){ 
              for (const i in uniquePolicies) {
                const fileRes = await sendToS3.getFromS3(`Policy/${uniquePolicies[i]}`)
                // console.log('fileRes',fileRes)
                if (fileRes && fileRes.Body){
                  files.push({fileName: uniquePolicies[i], file:fileRes?fileRes:null})
                }
              }
            }
        
            // group by insurance_company, insured_type
            const insurances = data.insuredpersons.map(i=>({plan_id: i.planId, insurance_company: i.compnayName, insured_type: i.eligilbeIns}));
            const insuredInsurances = groupBykeys(insurances,['plan_id','insurance_company','insured_type'],[],'');
            const langs = data.prefer_language && data.prefer_language ==='en'?['EN']:['EN', data.prefer_language.toUpperCase()];

            // insurance plan's documents
            for (const i in insuredInsurances) {
                // search plan's documents as languages
                const docSql = `select * 
                                    from plan_document pd 
                                    where plan_id = '${insuredInsurances[i].plan_id}'
                                    and document_type in ('Policy','Brochure','HowtoClaim')
                                    and language in ('${langs.join('\',\'')}')
                                    `
                const docRes = await pool.query(docSql);
                const docs = docRes.rowCount>0 ? docRes.rows :[] ;
                // language sort order -- sort order of English documents will be last
                const documents = docs.map(d=>({plan_id: d.plan_id, 
                                              document_type: d.document_type, 
                                              lang_sort_order: translation.filter(f=>f.language.toUpperCase() === d.language).length>0?translation.filter(f=>f.language.toUpperCase() === d.language)[0].sort_order:90, 
                                              language: d.language,
                                              document_url: d.document_url}))

                // Brochure
                const brochure = documents.filter(f=>f.document_type==='Brochure')
                                      .sort((a,b)=> a.lang_sort_order - b.lang_sort_order)[0];
                // Policy Wording
                const policyWording = documents.filter(f=>f.document_type==='Policy')
                                            .sort((a,b)=> a.lang_sort_order - b.lang_sort_order)[0];
                // HowtoClaim
                const howtoClaim = documents.filter(f=>f.document_type==='HowtoClaim')
                                        .sort((a,b)=> a.lang_sort_order - b.lang_sort_order)[0];

                //set linkUrls
                for (const p in data.insuredpersons) {
                  if (insuredInsurances[i].plan_id === data.insuredpersons[p].planId){
                    data.insuredpersons[p].linkUrls = {
                      brochure : brochure&&brochure.document_url?brochure.document_url:'',
                      policyWording : policyWording&&policyWording.document_url?policyWording.document_url:'',
                      howtoClaim : howtoClaim&&howtoClaim.document_url?howtoClaim.document_url:''
                    }
                  }
                }
                      
                // policyWording files for attache Files  
                if (policyWording && policyWording.document_url){ 
                  let fileRes = await sendToS3.getFromS3Bucket(policyWording.document_url)
                  if (policyWording.document_url.split("/")[1]){
                    files.push({fileName: `Policy-Wording-${policyWording.document_url.split("/")[1]}`, 
                                file: fileRes})
                  }
                }

            }

            // Attache Files
            for (const i in files) {
              attachmentList.push({filename: files[i].fileName,
                                    content: new Buffer.from(files[i].file.Body),
                                    contentType:  files[i].file.ContentType
              })
            }
            data.mailAttachedFile = attachmentList;
            
            // send approved confirmation email to client (attached policy, policy wording)
            var mailOptions = await emailLetter.letterMailOptions(source, data, trans)
            await mailer.sendEmail(mailOptions)

          } 
          
        }

        // console.log(source + ' confirmation mail has been sent successfully')
        // resolve(mailOptions)
        resolve({status: 200, message: 'confirmation mail has been sent successfully'})

      } catch (err) {
        console.error( `Error in sending ${source} confirmation email : `, err.message )
        reject(err)
      }
    })
  
  }


  // get data
  function getData (sql) {
    return new Promise(async (resolve, reject) => {
    try{
        // console.log('Get data for sending email')
        // console.log(sql)
        const getData = await pool.query(sql)
        // console.log(getData.rows[0])
        if (getData.rowCount !== 0) {
          resolve({status: 200, message: 'success', data: getData.rows[0]})
        } else{
          reject(err.message)
        }

    } catch (err) {
      console.log( ' getting data error : ', err.message )
      reject(err.message)
      }
    })
  }

  // get data
  function getRefundRequestedData (sql) {
    return new Promise(async (resolve, reject) => {
    try{
        // console.log('Get refund requested data for sending email')
        const getData = await pool.query(sql)
        // console.log('getData',getData.rows)
        // console.log(getData.rows[0])
        if (getData.rowCount !== 0) {
          const person = getData.rows
          const insuredpersons = []
          for (const i in person) {
                insuredpersons.push({
                firstName: person[i].firstName,
                lastName: person[i].lastName,
                birthDate: person[i].birthDate,
                insuranceCompany: person[i].insuranceCompany, 
                policyNumber: person[i].policyNumber,
                effectiveDate: person[i].effectiveDate
              })
          }
          const data = {
            requestDate: person[0].requestDate,
            confirmationNo: person[0].confirmationNo,
            email: person[0].email, 
            reason:  person[0].reason,
            prefer_language:  person[0].prefer_language,
            insuredpersons: insuredpersons
          }
  
          resolve({status: 200, message: 'success', data: data})
        } else{
          reject(err.message)
        }

    } catch (err) {
      console.log( ' getting data error : ', err.message )
      reject(err.message)
      }
    })
  }
  
  // moment Time Zone 
  function momentTimeZone(date,zone){
    const momentDate = moment.tz(date, zone).format('YYYY-MM-DD')
    // console.log('momentDate',momentDate)
    return(momentDate)
  }

  // groupbykeys
  function groupBykeys_sum(arr, groupKeys, sumKeys){
    var obj = Object.create(null),
    grouped = [];
    arr.forEach(function (o) {
    var key = groupKeys.map(function (k) { return o[k]; }).join('|');
        if (!obj[key]) {
            obj[key] = Object.keys(o).reduce((result, key)=> {
            result[key]=o[key]; 
            if(sumKeys.includes(key))
                result[key]=0;
            return result;
          }, { }); 
          grouped.push(obj[key]);
        }
        sumKeys.forEach(function (k) { obj[key][k] += o[k]; });
      });
    return grouped;
  }

  // groupbykeys
  function groupBykeys(arr, groupKeys, sumKeys, type){
    var obj = Object.create(null),
    grouped = [];
    arr.forEach(function (o) {
    var key = groupKeys.map(function (k) { return o[k]; }).join('|');
        if (!obj[key]) {
            obj[key] = Object.keys(o).reduce((result, key)=> {
            result[key]=o[key]; 
            if (type === 'sum'){
              if(sumKeys.includes(key)){result[key]=0};
            } else if ((type === 'detail')){
              if(sumKeys.includes(key)){result[key]=[]};
            }
            return result;
          }, { }); 
          grouped.push(obj[key]);
        }
        if (type === 'sum'){
          sumKeys.forEach(function (k) { obj[key][k] += o[k]; });
        } else if ((type === 'detail')){
          sumKeys.forEach(function (k) { return obj[key][k].push(o[k]); });
        }
      });
    return grouped;
  }

module.exports = { searchInsuredPerson, addInsuredPerson, addressInfo, addAddressInfo, 
                    updateAddressInfo, deleteAddressInfo,  addPaymentInfo, updatePaymentInfo, 
                    sendConfirmEmail, getData, getRefundRequestedData, momentTimeZone, groupBykeys
}
