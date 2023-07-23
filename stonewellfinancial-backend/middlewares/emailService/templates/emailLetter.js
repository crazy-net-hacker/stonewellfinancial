// travel application confirmation template
const {applicationConfirmation} = require('./applicationConfirmation')
// travel application payment confirmation template
const {paymentConfirmation} = require('./directPaymentConfirmation')
// travel application approved confirmation template
const {approvedConfirmation} = require('./applicationApprovedConfirmation')
// life insurance quote confirmation template
const {lifeQuoteConfirmation} = require('./lifeQuoteConfirmation')
// health insurance quote confirmation template
const {healthQuoteConfirmation} = require('./healthQuoteConfirmation')
// group benefits quote confirmation template
const {groupQuoteConfirmation} = require('./groupQuoteConfirmation')
// requesting refund confirmation template
const {refundRequestConfirmation} = require('./refundRequestConfirmation')


module.exports = {
    letterMailOptions(source, data, trans) {
console.log(data)
      return new Promise((resolve) => {
        let sendInfo = data
        let emailTitle = ''
        let description = ''
        let bgColor = ''
        let subjectText = ''
        let body = ''
        let sourceFrom = sendInfo.source_from==='O'? 'Online' : (sendInfo.source_from==='V'?'Vendor':'Form');
        
        switch (source) {
          case 'Travel':
            subjectText = sendInfo.payment[0].paymentMethod === 'E-transfer' ? (`${trans.COA_EtransferSubjectText ? trans.COA_EtransferSubjectText : 'Important: Email transfer Required for your Travel Insurance Application'}-${sendInfo.vendor_name}-${sourceFrom}`) : (`${trans.COA_SubjectText ? trans.COA_SubjectText : 'Your Travel Insurance application'}-${sendInfo.vendor_name}-${sourceFrom}`);
            emailTitle = sendInfo.payment[0].paymentMethod === 'E-transfer' ? (trans.COA_EtranferEmailTitle ? trans.COA_EtranferEmailTitle :'E-transfer Required for your Travel Insurance Application') : (trans.COA_EmailTitle ? trans.COA_EmailTitle : 'Your Request of travel insurance application (Not paid)');
            description = sendInfo.payment[0].paymentMethod === 'E-transfer' ? (`${sendInfo.application_id} - ${sendInfo.insured_type} - ${sendInfo.travel_direction_type}`) : (trans.COA_Description ? trans.COA_Description : 'This is not an official confirmation of policy. You will get an official confirmation when it proceeds payment successfully.');
            bgColor = '';
            body = applicationConfirmation(sendInfo, trans); 
              break;
          case 'Payment':
            subjectText = trans.COP_SubjectText?trans.COP_SubjectText:"Your Payment Confirmation" 
            emailTitle= trans.COP_EmailTitle?trans.COP_EmailTitle:"Thank you for your payment"
            description= trans.COP_Description?trans.COP_Description:"Your travel insurance application is processing. Once it is finalized, you will get a confirmation of policy via email."
            bgColor="#ffedc9"
            body = paymentConfirmation(sendInfo, trans)
              break;
          case 'Approved':
            subjectText = trans.CAA_SubjectText?trans.CAA_SubjectText:`Your Insurance Policy` 
            emailTitle= trans.CAA_EmailTitle?trans.CAA_EmailTitle:"Your Insurance Policy"
            description= trans.CAA_Description?trans.CAA_Description:""
            bgColor=""
            body = approvedConfirmation(sendInfo, trans)
              break;
          case 'Life':
            subjectText = trans.CLQ_SubjectText?trans.CLQ_SubjectText:'Thank you for requesting a Life Insurance quote'
            emailTitle= trans.CLQ_EmailTitle?trans.CLQ_EmailTitle:"Your life insurance quote request"
            description=trans.CLQ_Description?trans.CLQ_Description:"Thank you for requesting life insurance quote. One of our agents will contact you shortly."
            bgColor=""
            body = lifeQuoteConfirmation(sendInfo, trans)              
              break;
          case 'Health':
            subjectText = 'Thank you for requesting a Health Insurance quote'
            emailTitle="Your health insurance quote request"
            description="Thank you for requesting health insurance quote. One of our agents will contact you shortly."
            bgColor=""  
            body = healthQuoteConfirmation(sendInfo, trans)    
              break;
          case 'Group':
            subjectText = 'Thank you for requesting a Group Benefits Insurance quote'
            emailTitle="Your group benefits quote request"
            description="Thank you for requesting group benefits quote. One of our agents will contact you shortly."
            bgColor=""
            body = groupQuoteConfirmation(sendInfo, trans)              
              break;
          case 'Refund':
            subjectText = trans.CRR_SubjectText?trans.CRR_SubjectText:'Received your refund request'
            emailTitle= trans.CRR_EmailTitle?trans.CRR_EmailTitle:"Request a refund"
            description= trans.CRR_Description?trans.CRR_Description:"As requested by you, one of our agents will contact you shortly."
            bgColor=""
            body = refundRequestConfirmation(sendInfo, trans)
            break; 
          default:
              break
        }
      
        const mailOption = {
          from: {name:'Stonewell Financial', 
                address: process.env.MAIL_USER},
          // to: (source === 'Travel' && sendInfo.payment[0].paymentMethod === 'E-transfer')
          //       ? [sendInfo.email, 'sales@stonewellfinancial.com'].join(',')
          //       : (source === 'Travel')
          //         ? 'sales@stonewellfinancial.com'
          //         : sendInfo.email,

          // to: source === 'Travel' ? 'sales@stonewellfinancial.com' : sendInfo.email,
          // to: sendInfo.email,
          to: ( sendInfo.source_from !=='V' ? sendInfo.email : (sendInfo.vendor_email === 'info@stonewellfinancial.com' ? (source === 'Approved' ? sendInfo.email : 'sales@stonewellfinancial.com') : sendInfo.vendor_email)),
          // bcc: sendInfo.source_from==='O'?['sales@stonewellfinancial.com']:['sales@stonewellfinancial.com', sendInfo.vendor_email],
          // bcc: (source === 'Travel'||source === 'Refund')?( (sendInfo.source_from==='O' || sendInfo.vendor_email === 'info@stonewellfinancial.com') ? null: sendInfo.vendor_email ):'sales@stonewellfinancial.com',
          bcc: source === 'Travel'
                ?((sendInfo.source_from ==='M' && sendInfo.vendor_email !== 'info@stonewellfinancial.com') 
                    ? [sendInfo.vendor_email,'sales@stonewellfinancial.com'] 
                    : (sendInfo.source_from ==='V' && sendInfo.vendor_email === 'info@stonewellfinancial.com' ? null : 'sales@stonewellfinancial.com')
                  )
                :(source === 'Refund' 
                    ?  (sendInfo.vendor_email === 'info@stonewellfinancial.com' 
                          ? 'sales@stonewellfinancial.com'
                          : [sendInfo.vendor_email,'sales@stonewellfinancial.com'] 
                        )
                    :'sales@stonewellfinancial.com'
                  ),
          subject: subjectText,
          attachments: source === 'Approved' ? sendInfo.mailAttachedFile : null,
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
                         ${data.prefer_language === 'ko' ?
                            `
                            <table class="text_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                              <tr>
                                <td>
                                  <div style="font-family: sans-serif">
                                    <div style="font-size: 12px; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                      <p style="margin: 0; font-size: 12px; text-align: center;"><span style="color:blue;">
                                        <a href= 'https://open.kakao.com/o/skYkkGeb'
                                          target="_blank"
                                          style="text-decoration:none; text-align:center;">
                                        카카오톡 상담 바로가기</a> 
                                        <a href= 'https://pf.kakao.com/_xfCGqxl'
                                          target="_blank"
                                          style="text-decoration:none; text-align:center; padding-left:10px;">
                                        카톡플러스친구 상담 바로가기</a> 
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            `
                          :''}

                          <table class="text_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td>
                                <div style="font-family: sans-serif">
                                  <div style="font-size: 12px; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
                                    <p style="margin: 0; font-size: 12px; text-align: center;"><span style="color:#555555;">${trans.Sites?trans.Sites:'Life Insurance | Critical illness Insurance | Travel Insurance | Group Benefits | TFSA | RESP | RRSP'}</span></p>
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
              `
        }
  
        resolve(mailOption)
      })
    }

}