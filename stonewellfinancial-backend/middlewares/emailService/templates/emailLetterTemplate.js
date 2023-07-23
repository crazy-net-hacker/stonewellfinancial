module.exports = {
    letterMailOptions(email) {

      return new Promise((resolve) => {
        let emailTitle = 'Your travel insurance application'
        let description = '"Please send us an email if you require changes in your information'
        let bgColor = '#e8f4dc'
        let subjectText = 'Thank you for submitting a Travel Insurance application'
        let body = 'Body...'
      
        const mailOption = {
          from: {name:'Stonewell Financial', 
                address: process.env.MAIL_USER},
          to: email,
          subject: subjectText,
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
															<td style="padding-bottom:20px;padding-top:30px;width:100%;padding-right:0px;padding-left:0px;">
																<div style="line-height:10px"><a href="https://www.stonewellfinancial.com/" target="_blank" style="outline:none" tabindex="-1"><img src="https://stonewell-bucket.s3.ca-central-1.amazonaws.com/Image/stonewell_logo_col.png" style="display: block; height: auto; border: 0; width: 136px; max-width: 100%;" width="136" alt="Logo" title="Logo"></a></div>
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
                    
        <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: ${bgColor};">
            <tbody>
                <tr>
                    <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: ${bgColor}; background-position: center top; color: #000000;" width="680">
                            <tbody>
                                <tr>
                                    <th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                        <table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                            <tr>
                                                <td style="width:100%;padding-right:0px;padding-left:0px;">
                                                    <div align="center" style="line-height:10px"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1741/job.png" style="display: block; height: auto; border: 0; width: 238px; max-width: 100%;" width="238" alt="Your Application Summary" title="Alternate text"></div>
                                                </td>
                                            </tr>
                                        </table>
                                        <table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                            <tr>
                                                <td style="padding-bottom:5px;padding-left:20px;padding-right:20px;">
                                                    <div style="font-family: sans-serif">
                                                        <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #3fb9bc; line-height: 1.2; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;">
                                                            <p style="margin: 0; font-size: 14px; text-align: center;"><strong><span style="color:#2a2f71;font-size:38px;"><span style>${emailTitle}</span></span></strong></p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        <table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                            <tr>
                                                <td style="padding-bottom:30px;padding-left:15px;padding-right:15px;padding-top:15px;">
                                                    <div style="font-family: Arial, sans-serif">
                                                        <div style="font-size: 12px; font-family: 'Roboto Slab', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
                                                            <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:16px;">${description}</span></p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        <table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                            <tr>
                                                <td style="width:100%;padding-right:0px;padding-left:0px;">
                                                    <div align="center" style="line-height:10px"><img class="big" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1741/top.png" style="display: block; height: auto; border: 0; width: 680px; max-width: 100%;" width="680" alt="Alternate text" title="Alternate text"></div>
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

            <table class="row row-16" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e8f4dc;">
            <tbody>
              <tr>
                <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">
                    <tbody>
                      <tr>
                        <th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 35px; padding-bottom: 15px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                          <table class="text_block" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                            <tr>
                              <td>
                                <div style="font-family: sans-serif">
                                  <div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #2a2f71; line-height: 1.2; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;">
                                    <p style="margin: 0; font-size: 14px; text-align: center;"><span style="font-size:18px;">Do you have any questions?</span></p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table class="button_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px;text-align:center;">
                                <div align="center">
                                  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="mailto:info@stonewellfinancial.com" style="height:64px;width:156px;v-text-anchor:middle;" arcsize="55%" stroke="false" fillcolor="#8ec641"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:22px"><![endif]--><a href="mailto:info@stonewellfinancial.com" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#8ec641;border-radius:35px;width:auto;border-top:0px solid #2F7D81;border-right:0px solid #2F7D81;border-bottom:0px solid #2F7D81;border-left:0px solid #2F7D81;padding-top:10px;padding-bottom:10px;font-family:Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:45px;padding-right:45px;font-size:22px;display:inline-block;letter-spacing:normal;"><span style="line-height: 24px; word-break: break-word;"><span style="font-size: 22px; line-height: 44px;" data-mce-style="font-size: 22px; line-height: 44px;">Email us</span></span></span></a>
                                  <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
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
                          <table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                            <tr>
                              <td style="width:100%;padding-right:0px;padding-left:0px;">
                                <div align="center" style="line-height:10px"><img src="https://stonewell-bucket.s3.ca-central-1.amazonaws.com/Image/stonewell_logo_col.png" style="display: block; height: auto; border: 0; width: 170px; max-width: 100%;" width="170"></div>
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
                                    <p style="margin: 0; font-size: 12px; text-align: center;">Stonewell Financial Services INC © All rights reserved 2022</p>
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
                                    <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 18px;"><span style="font-size:12px;">This message was sent to <a style="text-decoration: none; color: #a6a4a2;" title="${email}" href="mailto:email@example.com">${email}</a></span></p>
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