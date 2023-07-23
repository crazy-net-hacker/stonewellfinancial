const moment = require('moment')

//
const trans_en = require('../../../middlewares/emailService/translation/languages/en.json')
const trans_fr = require('../../../middlewares/emailService/translation/languages/fr.json')
const trans_ko = require('../../../middlewares/emailService/translation/languages/ko.json')
const trans_ar = require('../../../middlewares/emailService/translation/languages/ar.json')
const trans_yue = require('../../../middlewares/emailService/translation/languages/yue.json')
const trans_ch_s = require('../../../middlewares/emailService/translation/languages/ch_s.json')
const trans_ch_t = require('../../../middlewares/emailService/translation/languages/ch_t.json')
const trans_de = require('../../../middlewares/emailService/translation/languages/de.json')
const trans_es = require('../../../middlewares/emailService/translation/languages/es.json')
const trans_fa = require('../../../middlewares/emailService/translation/languages/fa.json')
const trans_ja = require('../../../middlewares/emailService/translation/languages/ja.json')
const trans_pt_br = require('../../../middlewares/emailService/translation/languages/pt_br.json')
const trans_vi = require('../../../middlewares/emailService/translation/languages/vi.json')


// translation     
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

// sorting based on relationship
const relationship_sort = [
  { code: 'Primary', sort: 1 },
  { code: 'Spouse', sort: 2 },
  { code: 'Child', sort: 3 },
  { code: 'Parent', sort: 4 },
  { code: 'Siblings', sort: 5 },
  { code: 'Guardian', sort: 6 },
  { code: 'Companion', sort: 7 }
  ]

const sortNumber = (relationship) => {
  const order = relationship_sort.filter(f=>f.code ===relationship)
  return order.length > 0 ? order[0].sort : 9
}



// Get URL
const getURL = (plan, email) => {
  // const baseURL = 'http://localhost:3000/travel-insurance/d8bb983bb932b31/application'
  const baseURL = 'https://www.stonewellfinancial.com/travel-insurance/d8bb983bb932b31/application'
  
  const paramsInsured = JSON.stringify(
        plan.persons.sort((a,b)=> (a.source_from==='Z'?(new Date(a.birthdate)):sortNumber(a.relationship)) - (a.source_from==='Z'?(new Date(b.birthdate)):sortNumber(b.relationship))).map(p => ({
            firstName: p.firstname,
            lastName: p.lastname,
            birthDate: p.birthdate,
            gender: p.gender,
            tripStartDate: moment(new Date(p.expiry_date)).add(1, 'days').toISOString().substring(0,10)
        })));

  const paramsContact = JSON.stringify({
      street: plan.persons[0].street?plan.persons[0].street.replace('#', ' '):'',
      suiteNo: plan.persons[0].suite_no, 
      city: plan.persons[0].city,  
      province: plan.persons[0].province, 
      postalcode: plan.persons[0].postalcode, 
      country: plan.persons[0].country,
      email: email,
      phone: plan.persons[0].phone?plan.persons[0].phone:''
    });

  const URL = `${baseURL}/${plan.insured_type.toLowerCase()}/${plan.insurance_company.toLowerCase()}/individual?renewal=true&insured=${paramsInsured}&contact=${paramsContact}`;
  return encodeURI(URL);

}

// amount Format 
function amountFormat(amount, decimal)
{
    return (
    parseFloat(amount).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: decimal })
    )
}


const repurchaseInfo = (data, trans) => {
	return(
		`
      <td style="padding:0 35px;">
          <p style="color:#1e1e2d; font-size:16px; font-family:'Rubik',sans-serif; margin:10px; text-align:center; color:red; ">
            <strong>${trans.IEN_RenewNotice?trans.IEN_RenewNotice:'This email serves as an expiry notification for your previously purchased insurance. If you have already repurchased the insurance, please disregard this email.'}</strong>
          </p>
          ${data.renewable_plan.map(plan => (
            `
            
              <p style="color:#1e1e2d; font-size:20px; font-family:'Rubik',sans-serif;  margin-top:30px; margin-bottom:10px; text-align:center;">
                <strong><a title="Click here to re-purchase" href=${getURL(plan, data.email)}>${trans.IEN_ClickToRepurchase?trans.IEN_ClickToRepurchase:'Click here to re-purchase'}</a></strong>
              </p>
              

              ${plan.persons&&plan.persons.map(p => (
                `
                <tr>
                  <td style="vertical-align:top">
                    <table style="width:100%; border-collapse:collapse;  border-color:#ffffff">
                      <tr>
                        <td
                          style="border-bottom:1pt solid #f0f0f0; vertical-align:middle; background-color:#ffffff">
                          <p><span
                              style="font-family:Arial; font-weight:bold; color:#2a2f71">${trans.Relationship&&trans.Relationship.filter(f=>f.code===p.relationship).length>0 ? trans.Relationship.filter(f=>f.code===p.relationship)[0].name:p.relationship}</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                    <p></p>
                  </td>
                </tr>

                <tr>
                  <td style="vertical-align:top">
                    <table style="width:100%; border-collapse:collapse;  border-color:#ffffff">
                      <tr>
                        <td
                          style="padding:4.5pt; vertical-align:middle; background-color:#fcfcfc">
                          <table style="width:100%; border-collapse:collapse;  border-color:#ffffff; float:left">
                            <tr>
                              <td
                                style="width:49.96%; padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                <p><span
                                    style="font-family:Arial; color:#434343">${trans.Name?trans.Name:'Name'}
                                  </span>
                                </p>
                              </td>
                              <td
                                style="width:50.22%; padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                <p><span
                                    style="font-family:Arial; font-weight:bold; color:#2a2f71">${p.firstname} ${p.lastname}
                                    </span>
                                </p>
                              </td>
                            </tr>
                          
                            <tr>
                              <td
                                style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                <p><span
                                    style="font-family:Arial; color:#434343">
                                    ${trans.CAA_Insurance?trans.CAA_Insurance:'Insurance'}</span>
                              </td>
                              <td
                                style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                <p><span
                                    style="font-family:Arial; font-weight:bold; color:${plan.insurance_company === 'Tugo' ? '#00c7b2':(plan.insurance_company === 'Allianz'?'#a20000':(plan.insurance_company === 'BlueCross'?'#01aef0':'#00a850'))}">
                                    ${plan.insurance_company} ${plan.insured_type}
                                  </span>
                                  <span style="font-family:Arial; color:#434343">
                                    <br/>${amountFormat(p.plan_coverage,0)} coverage 
                                    ${p.tripType === 'MULTI' ?
                                    `<br/>${p.plan_multi_trip_days} days option`:
                                    ``}
                                  </span>
                                </p>
                              </td>
                            </tr>

                            <tr>
                              <td
                                style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                <p><span
                                    style="font-family:Arial; color:#434343">
                                    ${trans.CAA_PolicyNumber?trans.CAA_PolicyNumber:'Policy Number'}</span></p>
                              </td>
                              <td
                                style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                <p><span style="font-family:Arial; color:${plan.insurance_company === 'Tugo' ? '#00c7b2':(plan.insurance_company === 'Allianz'?'#a20000':(plan.insurance_company === 'BlueCross'?'#01aef0':'#00a850'))}">${p.policy_number}</span>
                                </p>
                              </td>
                            </tr>
                            

                            <tr>
                              <td
                                style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                <p><span
                                    style="font-family:Arial; color:#434343">
                                    ${trans.CAA_CoverageDays?trans.CAA_CoverageDays:'Coverage Period'}</span></p>
                              </td>
                              <td
                                style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                <p><span style="font-family:Arial">${p.effective_date} ~ <span
                                style="font-family:Arial; color:red; font-weight:bold">${p.expiry_date}</span> </span>
                                </p>
                              </td>
                            </tr>
                            
    
                          </table>
                          
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                  
                </tr>

                `
                )).join('')}
              
            `    
          )).join('')}
      </td>
    `
 
)}

module.exports = {
  letterMailOptions(data) {
    var preferLanguage = 'en'; 
    if (data.renewable_plan[0]){
        preferLanguage =  data.renewable_plan[0].persons?data.renewable_plan[0].persons[0].prefer_language:'en';
    }

    let trans = {};
    if (translation.filter(f=>f.language === (preferLanguage?preferLanguage:'en')).length>0){
      trans = translation.filter(f=>f.language === (preferLanguage?preferLanguage:'en'))[0].translate
    }else{
      trans = trans_en;
    }; 

    return new Promise((resolve) => {
      
      // let sendInfo = data
      let body = repurchaseInfo(data, trans)

      let emailTitle= trans && trans.IEN_EmailTitle?trans.IEN_EmailTitle:"Your insurance will expire soon."
      let description= trans && trans.IEN_Description?trans.IEN_Description: "If you repurchase before the expiry date, the waiting period for illness does not apply."

      const mailOption = {
        from: {name:'Stonewell Financial', 
              address: process.env.MAIL_USER},
        // to: 'samantha@stonewellfinancial.com',
        to: data.email,
        bcc: 'sales@stonewellfinancial.com',
        subject: trans && trans.IEN_EmailTitle?trans.IEN_EmailTitle:"Your insurance will expire soon.",
        html: `
        <div>
        <head>
              <title></title>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
              <!--[if !mso]><!-->
              <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css">
              <link href="https://fonts.googleapis.com/css?family=Oswald" rel="stylesheet" type="text/css">
              <link href="https://fonts.googleapis.com/css?family=Roboto+Slab" rel="stylesheet" type="text/css">
              <!--<![endif]-->
              <style>
                  * {
                      box-sizing: border-box;
                  }
          
                  body {
                      margin: 0;
                      padding: 0;
                  }
          
                  th.column {
                      padding: 0
                  }
          
                  a[x-apple-data-detectors] {
                      color: inherit !important;
                      text-decoration: inherit !important;
                  }
          
                  #MessageViewBody a {
                      color: inherit;
                      text-decoration: none;
                  }
          
                  p {
                      line-height: inherit
                  }
          
                  @media (max-width:700px) {
                      .row-content {
                          width: 100% !important;
                      }
          
                      .image_block img.big {
                          width: auto !important;
                      }
          
                      .mobile_hide {
                          display: none;
                      }
          
                      .stack .column {
                          width: 100%;
                          display: block;
                      }
          
                      .mobile_hide {
                          min-height: 0;
                          max-height: 0;
                          max-width: 0;
                          overflow: hidden;
                          font-size: 0px;
                      }
                  }
              </style>
          </head>

      <body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">

      <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
          <tbody>
            <tr>
              <td>
                <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">
                  <tbody>
                    <tr>
                      <th class="column" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                        <table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                          <tr>
                            <td style="padding-bottom:50px;padding-top:30px;padding-left:20px;width:100%;">
                              <div style="line-height:10px"><a href="https://www.stonewellfinancial.com/" target="_blank" style="outline:none" tabindex="-1"><img src="https://stonewell-bucket.s3.ca-central-1.amazonaws.com/Image/stonewell_logo_col.png" style="display: block; border: 0;" width="190.9"; height="70";  alt="Logo" title="Logo"></a></div>
                            </td>
                          </tr>
                        </table>
                      </th>
                      <th class="column" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                        <div class="spacer_block" style="height:5px;line-height:5px;font-size:1px;">&#8202;</div>
                        <div class="spacer_block mobile_hide" style="height:55px;line-height:55px;font-size:1px;">&#8202;</div>
                        <div class="spacer_block" style="height:5px;line-height:5px;font-size:1px;">&#8202;</div>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
      </table>
                  
      <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
          <tbody>
              <tr>
                  <td>
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-position: center top; color: #000000;" width="680">
                          <tbody>
                              <tr>
                                  <th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                    
                                      <table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                          <tr>
                                              <td style="padding-bottom:5px;padding-left:20px;padding-right:20px;">
                                                  <div style="font-family: sans-serif">
                                                      <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #3fb9bc; line-height: 1.2; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center;"><strong><span style="color:#2a2f71;font-size:25px;"><span style>${emailTitle}</span></span></strong></p>
                                                      </div>
                                                  </div>
                                              </td>
                                          </tr>
                                      </table>
                                      <table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                          <tr>
                                              <td style="padding-bottom:30px;padding-left:15px;padding-right:15px;padding-top:15px;">
                                                  <div style="font-family: Arial, sans-serif">
                                                      <div style="font-size: 12px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:14px;">${description}</span></p>
                                                      </div>
                                                  </div>
                                              </td>
                                          </tr>
                                      </table>
                                  </th>
                              </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>
          </tbody>
      </table>

          
          ${body}

        
        <table class="row row-17" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;">
          <tbody>
            <tr>
              <td>
                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">
                  <tbody>
                    <tr>
                      <th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                        <table class="html_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                          <tr>
                            <td>
                              <div style="font-family:Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;" align="center"><div style="height:30px;">&nbsp;</div></div>
                            </td>
                          </tr>
                        </table>
                        <table class="text_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                          <tr>
                            <td>
                              <div style="font-family: sans-serif">
                                <div style="font-size: 12px; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                  <p style="margin: 0; font-size: 12px; text-align: center;"><span style="color:#555555;">Life Insurance | Critical illness Insurance | Travel Insurance | Group Benefits | TFSA | RESP | RRSP</span></p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </table>
                        <table class="html_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                          <tr>
                            <td>
                              <div style="font-family:Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;" align="center"><div style="margin-top: 40px;border-top:1px dashed #D6D6D6;margin-bottom: 40px;"></div></div>
                            </td>
                          </tr>
                        </table>
                        <table class="text_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                          <tr>
                            <td>
                              <div style="font-family: sans-serif">
                                <div style="font-size: 12px; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #c0c0c0; line-height: 1.2;">
                                  <p style="margin: 0; font-size: 12px; text-align: center;">1-833-645-3858 (Toll Free in Canada) | info@stonewellfinancial.com</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="row row-18" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
          <tbody>
            <tr>
              <td>
                <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">
                  <tbody>
                    <tr>
                      <th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 30px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                        <table class="social_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                          <tr>
                            <td>
                              <table class="social-table" width="138px" border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                
                              </table>
                            </td>
                          </tr>
                        </table>
                        <table class="divider_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                          <tr>
                            <td>
                              <div align="center">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #E0E0E0;"><span>&#8202;</span></td>
                                  </tr>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </table>
                        <table class="text_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                          <tr>
                            <td>
                              <div style="font-family: Arial, sans-serif">
                                <div style="font-size: 12px; font-family: 'Roboto Slab', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #a6a4a2; line-height: 1.5;">
                                  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 18px;"><span style="font-size:12px;">This message was sent to <a style="text-decoration: none; color: #a6a4a2;" title="${data.email}" href="mailto:email@example.com">${data.email}</a></span></p>
                                  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 18px;"><span style="font-size:12px;">If you no longer wish to receive e-mails from us, <u><a style="text-decoration: none; color: #a6a4a2;" href="http://www.example.com/" target="_blank" rel="noopener">unsubscribe</a></u></span></p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

      </body>
  </div>
            `,
      }
      resolve(mailOption)
    })
  },
}


