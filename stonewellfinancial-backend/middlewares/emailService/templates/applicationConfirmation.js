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

// sorting based on relationship
const sortNumber = (relationship) => {
  const order = relationship_sort.filter(f=>f.code ===relationship)
  return order.length > 0 ? order[0].sort : 9
}

const applicationConfirmation = (data, trans) => {
	let sendInfo = data
	// sort based on relationship
	sendInfo.insuredpersons.length>0 && sendInfo.insuredpersons.sort((a,b)=> sortNumber(a.relationship) - sortNumber(b.relationship))

	// amount Format 
  function amountFormat(amount, decimal)
    {
        return (
        parseFloat(amount).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: decimal })
        )
    }
	

	return(
		`
		${data.payment[0].paymentMethod === 'E-transfer' ? 
			`
			<div style="margin: 0 20px;">
				<p>${trans.COA_EtransferInfo1?trans.COA_EtransferInfo1:'Thank you for submitting your travel insurance application. We have reviewed your application and would like to proceed with the insurance purchase. To complete the process, we kindly request that you make an email transfer for the total insurance premium within the next 48 hours.'}</p>
				<br><br>
				<p>${trans.COA_EtransferInfo2?trans.COA_EtransferInfo2:'Once we receive your email transfer, we will process your payment and notify you promptly. Upon approval by the insurance company, you will receive an official insurance policy via email.'}</p>
				<br><br>
						<p style="font-weight:700;">Email Transfer Information</p>
						<table style="border-collapse: collapse; width:100%">
							<tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
								<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Total Amount to send</td>
								<td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight:700; color:blue;">${amountFormat((parseFloat(data.total_amount) + parseFloat(data.family_plan_discount)),2)}</td>
							</tr>
							<tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
								<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Email</td>
								<td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight:700; color:blue;">justin@stonewellfinancial.com</td>
							</tr>
							<tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
								<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Recipient</td>
								<td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight:700;">Jeong Kim</td>
							</tr>
						</table>
				<br><br>
				<p>${trans.COA_EtransferInfo3?trans.COA_EtransferInfo3:`If you have any questions or require further assistance, please don't hesitate to reach out to us. We appreciate your prompt attention to this matter.`}</p>
			</div>
			` 
		:
		`
			${data.source_from !=='V' ? 
				`
				<div style="margin: 0 20px;">
					<p>${trans.COA_QuoteInfo1?trans.COA_QuoteInfo1:'Thank you for submitting your travel insurance application. We have reviewed your application and would like to proceed with the insurance purchase.'}</p>
					<br><br>
					<p>${trans.COA_QuoteInfo2?trans.COA_QuoteInfo2:'If there are no issues with the application information, we will process the payment immediately and notify you. Occasionally, payment may not go through due to incorrect card information, overseas payment restrictions, or exceeding the credit limit. In such cases, we will contact you again via email. Upon approval by the insurance company, you will receive an official insurance policy via email.'}</p>
					<br><br>
							<p style="font-weight:700;">Your Application</p>
							${data.insuredpersons.map(person => (
								`	
									<table style="border-collapse: collapse; width:100%">
										<tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
											<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${trans.Relationship&&trans.Relationship.filter(f=>f.code===person.relationship).length>0 ? trans.Relationship.filter(f=>f.code===person.relationship)[0].name:person.relationship}</td>
											<td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight:700; color:blue;">${person.firstName} ${person.lastName}</td>
										</tr>
										<tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
											<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Product</td>
											<td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight:700;">${person.compnayName} ${person.planName}</td>
										</tr>
										<tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
											<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Premium</td>
											<td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight:700;">${amountFormat(person.totalAmount,2)}</td>
										</tr>
									</table>
								`
							)).join('')}
					<br><br>
									<table style="border-collapse: collapse; width:100%">
										<tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
											<td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Total Premium</td>
											<td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight:700; color:blue;">${amountFormat((parseFloat(data.total_amount) + parseFloat(data.family_plan_discount)),2)}</td>
										</tr>
									</table>
					<p>${trans.COA_EtransferInfo3?trans.COA_EtransferInfo3:`If you have any questions or require further assistance, please don't hesitate to reach out to us. We appreciate your prompt attention to this matter.`}</p>
				</div>  
				`
				: 
				`
				<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;">
					<tbody>
						<tr>
							<td>
								
								<table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e8f4dc;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; background-position: center top; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-left: 25px; padding-right: 25px; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:20px;">
																			<div style="font-family: sans-serif">
																				<div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #3fb9bc; line-height: 1.2; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;">
																					<p style="margin: 0; font-size: 14px;"><span style="font-size:22px;color:#2a2f71;">${trans.COA_Quote?trans.COA_Quote:'Quote'} </span></p>
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
								<table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:5px;padding-left:35px;padding-right:20px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_Agency?trans.COA_Agency:'Agency'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${data.vendor_name}</span></p>
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:5px;padding-left:35px;padding-right:20px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_ConfirmationNo?trans.COA_ConfirmationNo:'Confirmation No.'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${data.confirmation_no}</span></p>
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:20px;padding-left:35px;padding-right:20px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_ApplicationDate?trans.COA_ApplicationDate:'Date'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${data.application_date.toLocaleDateString('en-CA', { day: 'numeric', month: 'short', year: 'numeric'})}</span></p>
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:20px;padding-left:35px;padding-right:20px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_SourceChannel?trans.COA_SourceChannel:'From'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${data.source_chnnel}</span></p>
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

								<table class="row row-14" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td style="width:100%;padding-right:0px;padding-left:0px;">
																			<div align="center" style="line-height:10px"><img class="big" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1741/bottom.png" style="display: block; height: auto; border: 0; width: 680px; max-width: 100%;" width="680" alt="Alternate text" title="Alternate text"></div>
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

								<table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; background-position: center top; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-left: 25px; padding-right: 25px; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:20px;">
																			<div style="font-family: sans-serif">
																				<div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #3fb9bc; line-height: 1.2; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;">
																					<p style="margin: 0; font-size: 14px;"><span style="font-size:22px;color:#2a2f71;">${trans.COA_Applicants?trans.COA_Applicants:'Applicant(s)'}</span></p>
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
								
								${data.insuredpersons.map(person => (
									`
								<table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:5px;padding-left:35px;padding-right:15px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.Relationship&&trans.Relationship.filter(f=>f.code===person.relationship).length>0 ? trans.Relationship.filter(f=>f.code===person.relationship)[0].name:person.relationship}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${person.firstName} ${person.lastName}</span></p>
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:5px;padding-left:35px;padding-right:15px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;"><span style="font-size:14px;color:#44b4b8;">${trans.COA_DOB?trans.COA_DOB:'Date of Birth'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;"><span style="font-size:14px;">${person.birthdate} (${person.age} yrs)</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 18px;">&nbsp;</p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;"><span style="font-size:14px;color:#44b4b8;">${trans.COA_Gender?trans.COA_Gender:'Gender'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;"><span style="font-size:14px;">${person.gender}</span></p>
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:20px;padding-left:35px;padding-right:15px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_Beneficiary?trans.COA_Beneficiary:'Beneficiary'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${person.beneficiaryName} </span><span style="font-size:16px;">(${trans.Relationship&&trans.Relationship.filter(f=>f.code===person.beneficiaryRelationship).length>0 ? trans.Relationship.filter(f=>f.code===person.beneficiaryRelationship)[0].name:person.beneficiaryRelationship})</span></p>
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
								<table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 10px; padding-bottom: 10px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="divider_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td>
																			<div align="center">
																				<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																					<tr>
																						<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;"></td>
																					</tr>
																				</table>
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
								`
							)).join('')}
							<table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
							<tbody>
								<tr>
									<td>
										<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">
											<tbody>
												<tr>
													<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
														<table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
															<tr>
																<td style="width:100%;padding-right:0px;padding-left:0px;">
																	<div align="center" style="line-height:10px"><img class="big" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1741/bottom.png" style="display: block; height: auto; border: 0; width: 680px; max-width: 100%;" width="680" alt="Alternate text" title="Alternate text"></div>
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
								<table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; background-position: center top; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-left: 25px; padding-right: 25px; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:20px;">
																			<div style="font-family: sans-serif">
																				<div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #3fb9bc; line-height: 1.2; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;">
																					<p style="margin: 0; font-size: 14px;"><span style="font-size:22px;color:#2a2f71;">${trans.COA_Address?trans.COA_Address:'Address'}</span></p>
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
								<table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="41.666666666666664%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:10px;padding-left:35px;padding-right:20px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_Street?trans.COA_Street:'Street'}</span></p>
																						${data.address.filter(f=>f.useType === 'Mailling').map(a => (
																							`
																							<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${a.street}</span></p>
																							`
																						))}
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:5px;padding-left:35px;padding-right:20px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_UnitNumber?trans.COA_UnitNumber:'Unit Number'}</span></p>
																					${data.address.filter(f=>f.useType === 'Mailling').map(a => (
																						`
																						<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${a.suiteNo}</span></p>
																						`
																					))}
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-left:35px;padding-right:20px;padding-top:15px;padding-bottom:5px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_City?trans.COA_City:'City'}</span></p>
																					${data.address.filter(f=>f.useType === 'Mailling').map(a => (
																						`
																						<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${a.city}</span></p>
																						`
																					))}
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
								<table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="41.666666666666664%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:5px;padding-left:35px;padding-right:20px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="background-color:transparent;font-size:15px;"><span style="color:#44b4b8;">${trans.COA_Province?trans.COA_Province:'Province'}</span></span></p>
																					${data.address.filter(f=>f.useType === 'Mailling').map(a => (
																						`
																						<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${a.province}</span></p>
																						`
																					))}
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:5px;padding-left:35px;padding-right:20px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_PostalCode?trans.COA_PostalCode:'Postal Code'}</span></p>
																					${data.address.filter(f=>f.useType === 'Mailling').map(a => (
																						`
																						<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${a.postalcode}</span></p>
																						`
																					))}
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:10px;padding-left:35px;padding-right:20px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_Country?trans.COA_Country:'Country'}</span></p>
																					${data.address.filter(f=>f.useType === 'Mailling').map(a => (
																						`
																						<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${a.country}</span></p>
																						`
																					))}
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 18px;">&nbsp;</p>
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
								<table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td style="width:100%;padding-right:0px;padding-left:0px;">
																			<div align="center" style="line-height:10px"><img class="big" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1741/bottom.png" style="display: block; height: auto; border: 0; width: 680px; max-width: 100%;" width="680" alt="Alternate text" title="Alternate text"></div>
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
								<table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; background-position: center top; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-left: 25px; padding-right: 25px; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:20px;">
																			<div style="font-family: sans-serif">
																				<div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #3fb9bc; line-height: 1.2; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;">
																					<p style="margin: 0; font-size: 14px;"><span style="font-size:22px;color:#2a2f71;">${trans.COA_Contact?trans.COA_Contact:'Contact'}</span></p>
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
								<table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="41.666666666666664%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:5px;padding-left:35px;padding-right:20px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_Phone?trans.COA_Phone:'Phone'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${data.phone}</span></p>
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="58.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:20px;padding-left:35px;padding-right:20px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_Email?trans.COA_Email:'Email'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${data.email}</span></p>
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
								<table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td style="width:100%;padding-right:0px;padding-left:0px;">
																			<div align="center" style="line-height:10px"><img class="big" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1741/bottom.png" style="display: block; height: auto; border: 0; width: 680px; max-width: 100%;" width="680" alt="Alternate text" title="Alternate text"></div>
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
								<table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; background-position: center top; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-left: 25px; padding-right: 25px; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:20px;">
																			<div style="font-family: sans-serif">
																				<div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #3fb9bc; line-height: 1.2; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;">
																					<p style="margin: 0; font-size: 14px;"><span style="font-size:22px;color:#2a2f71;">${trans.COA_Notice?trans.COA_Notice:'Notice of Application Request'}</span></p>
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
								<table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="58.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:20px;padding-left:35px;padding-right:20px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:red;">*${trans.COA_NoticeDesc?trans.COA_NoticeDesc:'This is not an official confirmation of policy. You will get an official confirmation when it proceeds payment successfully. It can not be used as a proof of purchasing an insurance.'}</span></p>
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
								<table class="row row-14" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td style="width:100%;padding-right:0px;padding-left:0px;">
																			<div align="center" style="line-height:10px"><img class="big" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1741/bottom.png" style="display: block; height: auto; border: 0; width: 680px; max-width: 100%;" width="680" alt="Alternate text" title="Alternate text"></div>
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
								<table class="row row-15" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; background-position: center top; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-left: 25px; padding-right: 25px; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:20px;">
																			<div style="font-family: sans-serif">
																				<div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #3fb9bc; line-height: 1.2; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;">
																					<p style="margin: 0; font-size: 14px;"><span style="font-size:22px;color:#2a2f71;">${trans.COA_Trip?trans.COA_Trip:'Your trip'}</span></p>
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
								<table class="row row-16" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:5px;padding-left:35px;padding-right:20px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_TripFrom?trans.COA_TripFrom:'From'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">
																						${data.insuredpersons[0].originCountry} ${data.insuredpersons[0].originProvince}
																					</span></p>
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:5px;padding-left:35px;padding-right:20px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_TripDestination?trans.COA_TripDestination:'Destination'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">
																						${data.insuredpersons[0].destCountry} ${data.insuredpersons[0].destProvince}
																					</span></p>
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:10px;padding-left:35px;padding-right:20px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_TripArrivalDate?trans.COA_TripArrivalDate:'Arrival Date'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${data.insuredpersons[0].arrivalDate?data.insuredpersons[0].arrivalDate:``}</span></p>
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:10px;padding-left:35px;padding-right:20px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_HomeCountry?trans.COA_HomeCountry:'Home country'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${data.insuredpersons[0].originCountry}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 18px;">&nbsp;</p>
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
								<table class="row row-17" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td style="width:100%;padding-right:0px;padding-left:0px;">
																			<div align="center" style="line-height:10px"><img class="big" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1741/bottom.png" style="display: block; height: auto; border: 0; width: 680px; max-width: 100%;" width="680" alt="Alternate text" title="Alternate text"></div>
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
								<table class="row row-18" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; background-position: center top; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-left: 25px; padding-right: 25px; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:20px;">
																			<div style="font-family: sans-serif">
																				<div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #3fb9bc; line-height: 1.2; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;">
																					<p style="margin: 0; font-size: 14px;"><span style="font-size:22px;color:#2a2f71;">${trans.COA_YourInsurance?trans.COA_YourInsurance:'Your Insurance'}</span></p>
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
								${data.insuredpersons.map(person => (
								`
								<table class="row row-19" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-left:35px;padding-right:5px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${person.relationship}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${person.firstName} ${person.lastName}</span></p>
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-left:35px;padding-right:15px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_Insurance?trans.COA_Insurance:'Insurance'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;"><span style="font-size:14px;">${person.compnayName}  ${person.planName}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 18px;"><span style="font-size:12px;color:#979797;">&nbsp; &nbsp; &nbsp;${amountFormat(person.coverage,0)} coverage 
																																																				<br/>&nbsp; &nbsp; &nbsp; ${amountFormat(person.deductible,0)} deductible
																																																				${person.tripType === 'MULTI' ?
																																																				`<br/>&nbsp; &nbsp; &nbsp; ${person.multiTripDays} days option`:
																																																				``}
																																																				</span></p>
																					
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-left:35px;padding-right:15px;padding-top:10px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_OptionalPlan?trans.COA_OptionalPlan:'Optional Plan'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;">
																						<span style="font-size:14px;"> 
																						${person.optionPlan&&person.optionPlan.map((op, opIndex) => (
																							`
																							${op.optionPlanName}
																							${person.optionPlan.length > opIndex ? `<br/>`:``}
																						
																							<span style="font-size:12px;color:#979797;">
																								&nbsp; &nbsp; &nbsp;  ${amountFormat(op.optionPlanCoverage,0)} coverage 
																							</span>
																							<br/>
																							`
																							)).join('') 
																						}</span>
																					
																					</p>
																				

																				
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-left:35px;padding-right:15px;padding-top:10px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_Services?trans.COA_Services:'Services'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;"><span style="font-size:14px;">${person.carewellServiceAmount === 0 ? `-` : `${person.carewellService}`} </span></p>
																				
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-left:35px;padding-right:10px;padding-top:15px;padding-bottom:5px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_CoverageDays?trans.COA_CoverageDays:'Coverage days'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;"><span style="font-size:14px;">${person.tripStartDate} ~ ${person.tripEndDate}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;"><span style="font-size:14px;color:#979797;">${person.tripPeriod} days</span></p>
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="16.666666666666668%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:10px;padding-left:35px;padding-right:15px;padding-top:15px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_TotalPremium?trans.COA_TotalPremium:'Total'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${amountFormat(person.totalAmount,2)}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;"><span style="font-size:14px;color:#979797;">${trans.COA_NotPaid?trans.COA_NotPaid:'Not paid'}</span></p>
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
								<table class="row row-20" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="divider_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td style="padding-top:10px;">
																			<div align="center">
																				<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																					<tr>
																						<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #DFDFDF;"><span>&#8202;</span></td>
																					</tr>
																				</table>
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
								`	
								)).join('')}
							
								<table class="row row-23" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; background-position: center top; color: #000000;" width="680">
													<tbody>
														${data.family_plan_amount > 0 ? `
															<tr>
																<th class="column" width="75%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-left: 25px; padding-right: 25px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:35px;">
																				<div style="font-family: sans-serif">
																					<div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #3fb9bc; line-height: 1.2; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;">
																						<p style="margin: 0; font-size: 14px;"><span style="font-size:16px;color:#555555;">Premium Total:</span></p>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</table>
																</th>
																<th class="column" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td style="padding-bottom:15px;padding-left:15px;padding-right:15px;padding-top:25px;">
																				<div style="font-family: Arial, sans-serif">
																					<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																						<p style="margin: 0; font-size: 14px; text-align: right; mso-line-height-alt: 33px;"><span style="font-size:22px;color:#2a2f71;">${amountFormat((parseFloat(data.total_amount) + parseFloat(data.family_plan_discount)),2)}</span></p>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</table>
																</th>
															</tr>
															<tr>
																<th class="column" width="75%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-left: 25px; padding-right: 25px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:35px;">
																				<div style="font-family: sans-serif">
																					<div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #3fb9bc; line-height: 1.2; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;">
																						<p style="margin: 0; font-size: 14px;"><span style="font-size:16px;color:#555555;">Family discount:</span></p>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</table>
																</th>
																<th class="column" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																	<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																		<tr>
																			<td style="padding-bottom:15px;padding-left:15px;padding-right:15px;padding-top:25px;">
																				<div style="font-family: Arial, sans-serif">
																					<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																						<p style="margin: 0; font-size: 14px; text-align: right; mso-line-height-alt: 33px;"><span style="font-size:22px;color:#2a2f71;">${amountFormat(data.family_plan_discount,2)}</span></p>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</table>
																</th>
															</tr>
														`:``}								
														<tr>
															<th class="column" width="75%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-left: 25px; padding-right: 25px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:35px;">
																			<div style="font-family: sans-serif">
																				<div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #3fb9bc; line-height: 1.2; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;">
																					<p style="margin: 0; font-size: 14px;"><span style="font-size:16px;color:#555555;">${trans.COA_YourQuoteTotal?trans.COA_YourQuoteTotal:'Your Quote Total'}:</span></p>
																				</div>
																			</div>
																		</td>
																	</tr>
																</table>
															</th>
															<th class="column" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:15px;padding-left:15px;padding-right:15px;padding-top:25px;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.2;">
																					<p style="margin: 0; font-size: 14px; text-align: right; mso-line-height-alt: 33px;"><span style="font-size:22px;color:#2a2f71;">${amountFormat(data.total_amount,2)}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: right; mso-line-height-alt: 33px;""><span style="font-size:16px;color:red;">(${trans.COA_PaymentPending?trans.COA_PaymentPending:'Payment Pending'})</span></p>		
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
								<table class="row row-24" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td style="width:100%;padding-right:0px;padding-left:0px;">
																			<div align="center" style="line-height:10px"><img class="big" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1741/bottom.png" style="display: block; height: auto; border: 0; width: 680px; max-width: 100%;" width="680" alt="Alternate text" title="Alternate text"></div>
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
								<table class="row row-25" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; background-position: center top; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-left: 25px; padding-right: 25px; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr>
																		<td style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:20px;">
																			<div style="font-family: sans-serif">
																				<div style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #3fb9bc; line-height: 1.2; font-family: Oswald, Arial, Helvetica Neue, Helvetica, sans-serif;">
																					<p style="margin: 0; font-size: 14px;"><span style="font-size:22px;color:#2a2f71;">${trans.COA_PaymentPending?trans.COA_PaymentPending:'Payment Pending'}</span></p>
																					<p style="margin: 0; font-size: 14px;"><span style="font-size:16px;color:red;">*${trans.COA_PaymentDesc?trans.COA_PaymentDesc:'Payment has not been made or proceed this moment.'}</span></p>
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
								<table class="row row-26" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="text_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
																	<tr style="vertical-align: top;">
																		<td width="40%" style="padding-bottom:5px;padding-left:35px;padding-right:20px;padding-top:10px;vertical-align: top;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_PaymentMethod?trans.COA_PaymentMethod:'Method'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">
																					${data.payment[0].paymentMethod === 'Creditcard' && data.payment[0].PaymentBy !== 'Client' ? `<span style="font-size:16px;">${data.payment[0].creditCardType}</span>` : `<span style="font-size:16px;">${data.payment[0].paymentMethod}</span>`}
																					${data.payment[0].paymentMethod === 'E-transfer' ? `<p>Sender : ${data.payment[0].senderName}</p>` : `` }
																					<span style="color:#979797;"> 
																						${data.payment[0].paymentMethod === 'Creditcard' && data.payment[0].PaymentBy !== 'Client' && data.payment[0].creditCardNumber
																						? `<p>${'*'.repeat(data.payment[0].creditCardNumber.length - 4) + data.payment[0].creditCardNumber.substr(data.payment[0].creditCardNumber.length-4,4)} </p>`
																						: ``}
																					</span></p>
																					
																				</div>
																			</div>
																		</td>
																		${data.payment[0].paymentMethod === 'E-transfer' ? `
																		<td width="60%" style="padding-bottom:5px;padding-left:35px;padding-right:20px;padding-top:10px;vertical-align: top;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_EtransferPayment?trans.COA_EtransferPayment:'Please send money to the email below'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">justin@stonewellfinancial.com</span></p>
																				</div>
																			</div>
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;margin-top:15px">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">${trans.COA_EtransferPaymentNote1?trans.COA_EtransferPaymentNote1:'If you do not make the transfer within 48 hours, the application will be invalid. As soon as we confirm the e-transfer, the insurance purchase proceeds.'}</span></p>
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;">
																						<span style="color:#979797;"> 
																						* ${trans.COA_EtransferPaymentNote2?trans.COA_EtransferPaymentNote2:'The name of the sender and the deposit amount must be the same as in the application form. If you have made a different deposit by mistake, please contact info@stonewellfinancial.com.'}
																						</span>
																					</p>
																				</div>
																			</div>
																		</td>
																		`:``}
																		${data.payment[0].PaymentBy === 'Client' ? `
																		<td width="60%" style="padding-bottom:5px;padding-left:35px;padding-right:20px;padding-top:10px;vertical-align: top;">
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 22.5px;"><span style="font-size:15px;color:#44b4b8;">${trans.COA_CreditPaymentRequest?trans.COA_CreditPaymentRequest:'You will get a payment request email soon.'}</span></p>
																				</div>
																			</div>
																			<div style="font-family: Arial, sans-serif">
																				<div style="font-size: 12px; font-family: 'Oswald', Arial, 'Helvetica Neue', Helvetica, sans-serif; mso-line-height-alt: 18px; color: #3a4848; line-height: 1.5;margin-top:15px">
																					<p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;">
																						<span style="color:#979797;"> 
																						* ${trans.COA_CreditPaymentRequestNote?trans.COA_CreditPaymentRequestNote:'We will proceed your application once you complete the online payment.'}
																						</span>
																					</p>
																				</div>
																			</div>
																		</td>
																		`:``}
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
								
								<table class="row row-28" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3f7f2;">
									<tbody>
										<tr>
											<td>
												<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000;" width="680">
													<tbody>
														<tr>
															<th class="column" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
																<table class="image_block" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																	<tr>
																		<td style="width:100%;padding-right:0px;padding-left:0px;">
																			<div align="center" style="line-height:10px"><img class="big" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1741/bottom.png" style="display: block; height: auto; border: 0; width: 680px; max-width: 100%;" width="680" alt="Alternate text" title="Alternate text"></div>
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
								
								
								
							</td>
						</tr>
					</tbody>
				</table>
				`

			}
		`}
		`
	)}

module.exports = {applicationConfirmation}
