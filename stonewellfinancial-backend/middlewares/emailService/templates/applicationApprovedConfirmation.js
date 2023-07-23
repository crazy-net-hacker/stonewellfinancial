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

const S3_URL = 'https://stonewell-bucket.s3.ca-central-1.amazonaws.com/'

// sorting based on relationship
const sortNumber = (relationship) => {
  const order = relationship_sort.filter(f=>f.code ===relationship)
  return order.length > 0 ? order[0].sort : 9
}

const approvedConfirmation = (data, trans) => {
	let sendInfo = data
	// sort based on relationship
	sendInfo.insuredpersons.length>0 && sendInfo.insuredpersons.sort((a,b)=> sortNumber(a.relationship) - sortNumber(b.relationship))

	// console.log('data.insuredpersons', data.insuredpersons)
	// amount Format 
  function amountFormat(amount, decimal)
    {
        return (
        parseFloat(amount).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: decimal })
        )
    }
	

	return(
		`
		<!DOCTYPE html>
		<html lang="en-US">
		
		<head>
			<meta charset="utf-8" />
			<meta name="generator" content="Aspose.Words for .NET 23.2.0" />
			<title></title>
			<style type="text/css">
				@page Section1 {
					size: 612pt 792pt;
					margin: 25pt;
					-aw-footer-distance: 35.4pt;
					-aw-header-distance: 35.4pt
				}
		
		
				div.Section1 {
					page: Section1
				}
		
				body {
					font-family: 'Times New Roman';
					font-size: 12pt;
				}
		
				h1,
				h2,
				h3,
				h4,
				h5,
				h6,
				p {
					margin: 0pt
				}
		
				table {
					margin-top: 0pt;
					margin-bottom: 0pt;
				}
		
				h1 {
					margin-top: 12pt;
					margin-bottom: 0pt;
					page-break-inside: avoid;
					page-break-after: avoid;
					font-family: 'Times New Roman';
					font-size: 24pt;
					font-weight: bold;
					font-style: normal;
					color: #2f5496
				}
		
				h2 {
					margin-top: 2pt;
					margin-bottom: 0pt;
					page-break-inside: avoid;
					page-break-after: avoid;
					font-family: 'Times New Roman';
					font-size: 18pt;
					font-weight: bold;
					font-style: normal;
					color: #2f5496
				}
		
				h3 {
					margin-top: 2pt;
					margin-bottom: 0pt;
					page-break-inside: avoid;
					page-break-after: avoid;
					font-family: 'Times New Roman';
					font-size: 14pt;
					font-weight: bold;
					font-style: normal;
					color: #1f3763
				}
		
				h4 {
					margin-top: 2pt;
					margin-bottom: 0pt;
					text-align: left;
					page-break-inside: avoid;
					page-break-after: avoid;
					font-family: 'Times New Roman';
					font-size: 12pt;
					font-weight: bold;
					font-style: normal;
					color: #2f5496
				}
		
				h5 {
					margin-top: 2pt;
					margin-bottom: 0pt;
					page-break-inside: avoid;
					page-break-after: avoid;
					font-family: 'Times New Roman';
					font-size: 10pt;
					font-weight: bold;
					font-style: normal;
					color: #2f5496
				}
		
				h6 {
					margin-top: 2pt;
					margin-bottom: 0pt;
					page-break-inside: avoid;
					page-break-after: avoid;
					font-family: 'Times New Roman';
					font-size: 8pt;
					font-weight: bold;
					font-style: normal;
					color: #1f3763
				}
		
				span.Heading1Char {
					font-family: 'Calibri Light';
					font-size: 16pt;
					color: #2f5496
				}
		
				span.Heading2Char {
					font-family: 'Calibri Light';
					font-size: 13pt;
					color: #2f5496
				}
		
				span.Heading3Char {
					font-family: 'Calibri Light';
					font-size: 12pt;
					color: #1f3763
				}
		
				span.Heading4Char {
					font-family: 'Calibri Light';
					font-style: italic;
					color: #2f5496
				}
		
				span.Heading5Char {
					font-family: 'Calibri Light';
					color: #2f5496
				}
		
				span.Heading6Char {
					font-family: 'Calibri Light';
					color: #1f3763
				}
		
				span.headerLineText {
					font-family: sans-serif;
					font-size: 11pt;
					font-weight: normal
				}
		
				span.headerLineTitle {
					font-family: sans-serif;
					font-size: 11pt;
					font-weight: bold
				}

				.cols {
					
				}
			
		
				.contentInner {}
		
				.contentOuter {}
			</style>
		</head>
		
		<body align="center">
			<div class="Section1">
				
			
				<table class="contentOuter" width="680" align="center">
					<tr>
						<td style="vertical-align:middle; background-color:#ffffff">
							<table class="contentInner"
								style="width:450pt; margin-right:auto; margin-left:auto; border-collapse:collapse;  border-color:#ffffff">
								<tr>
									<td style="vertical-align:top;">
										<table style="width:100%; border-collapse:collapse;  border-color:#ffffff">

											${data.insuredpersons.map(person => (
											`
											<tr>
												<td style="vertical-align:top">
													<table style="width:100%; border-collapse:collapse;  border-color:#ffffff">
														<tr>
															<td
																style="border-bottom:1pt solid #f0f0f0; padding:4.5pt 12.25pt; vertical-align:middle; background-color:#ffffff">
																<p><span
																		style="font-family:Arial; font-weight:bold; color:#2a2f71">${trans.Relationship&&trans.Relationship.filter(f=>f.code===person.relationship).length>0 ? trans.Relationship.filter(f=>f.code===person.relationship)[0].name:person.relationship}</span>
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
																style="padding:4.5pt 12.25pt; vertical-align:middle; background-color:#fcfcfc">
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
																					style="font-family:Arial; font-weight:bold; color:#2a2f71">${person.lastName}, ${person.firstName} 
																					</span>
																			</p>
																		</td>
																	</tr>
																	<tr>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span
																					style="font-family:Arial; color:#434343">${trans.CAA_DOB?trans.CAA_DOB:'Date of Birth'}
																				</span><br />
																			</p>
																		</td>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span
																					style="font-family:Arial; font-weight:bold; color:#434343">${person.birthdate} (${person.age} yrs)</span>
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
																					style="font-family:Arial; font-weight:bold; color:${person.compnayName === 'Tugo' ? '#00c7b2':(person.compnayName === 'Allianz'?'#a20000':(person.compnayName === 'BlueCross'?'#01aef0':'#00a850'))}">
																					${person.compnayName}  ${person.planName}
																				</span>
																				<span style="font-family:Arial; color:#434343">
																					<br/>${amountFormat(person.coverage,0)} coverage 
																					<br/>${amountFormat(person.deductible,0)} deductible
																					${person.tripType === 'MULTI' ?
																					`<br/>${person.multiTripDays} days option`:
																					``}
																				</span>
																			</p>
																		</td>
																	</tr>
																	<tr>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span
																					style="font-family:Arial; color:#434343">${trans.CAA_PolicyNumber?trans.CAA_PolicyNumber:'Policy Number'}
																				</span><br />
																			</p>
																		</td>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span
																					style="font-family:Arial; font-weight:bold; color:${person.compnayName === 'Tugo' ? '#00c7b2':(person.compnayName === 'Allianz'?'#a20000':(person.compnayName === 'BlueCross'?'#01aef0':'#00a850'))}">
																					${person.policyNo}
																				</span>
																			</p>
																		</td>
																	</tr>
																	<tr>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span
																					style="font-family:Arial; color:#434343">
																					${trans.CAA_OptionalPlan?trans.CAA_OptionalPlan:'Optional Plan'}
																				</span><br />
																			</p>
																		</td>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span
																					style="font-family:Arial; font-weight:bold; color:#434343">
																					${person.optionPlan.length > 0 ?
																					`
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
																						}
																					`
																					:'Not Purchased'}	
																				</span>
																			</p>
																		</td>
																	</tr>

																	<tr>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span
																					style="font-family:Arial; color:#434343">${trans.CAA_Services?trans.CAA_Services:'Services'}
																				</span><br />
																			</p>
																		</td>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span
																					style="font-family:Arial; font-weight:bold; color:${person.carewellServiceAmount === 0 ?'#434343':'#ffcc00'}">
																					${person.carewellServiceAmount === 0 ? `Not Purchased` : `${person.carewellService}`}
																				</span>
																			</p>
																		</td>
																	</tr>

																	<tr>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span
																					style="font-family:Arial; color:#434343">
																					${trans.CAA_CoverageDays?trans.CAA_CoverageDays:'Coverage days'}</span></p>
																		</td>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span style="font-family:Arial">${person.tripStartDate} ~ ${person.tripEndDate} </span><span
																					style="font-family:Arial; color:#434343">(${person.tripPeriod} days)</span>
																			</p>
																		</td>
																	</tr>
																	<tr>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span
																					style="font-family:Arial; color:#434343">
																					${trans.CAA_TotalPremium?trans.CAA_TotalPremium:'Total'}</span>
																			</p>
																		</td>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span style="font-family:Arial">${amountFormat(person.totalAmount,2)} CAD</span>
																			</p>
																		</td>
																	</tr>
					
																</table>
																
															</td>
														</tr>
													</table>
													
												</td>
												
											</tr>

											<tr>
												<td style="vertical-align:top; margin-bottom:15px;">
													<table style="width:100%; border-collapse:collapse;  border-color:#ffffff;">
														<tr>
															<td style="padding-top:10pt; padding-bottom:10pt; vertical-align:middle; 
																background-color:${person.compnayName === 'Tugo' ? '#00c7b2':(person.compnayName === 'Allianz'?'#a20000':(person.compnayName === 'BlueCross'?'#01aef0':'#00a850'))}; text-align:left;">
																<p style="font-family:Arial; color:#fff; font-weight:700; text-align:center">
																	${person.linkUrls && person.linkUrls.brochure &&
																		`<a href= ${S3_URL}${person.linkUrls.brochure}
																			target="_blank"
																			style="text-decoration:none; text-align:center; color:#fff;">
																			<span style="text-decoration:underline; padding:5px">
																			${trans.Brochure?trans.Brochure:'Brochure'}</span>
																			</a> `
																	}	
																</p>
															</td>
															<td style="padding-top:10pt; padding-bottom:10pt; vertical-align:middle;
																background-color:${person.compnayName === 'Tugo' ? '#00c7b2':(person.compnayName === 'Allianz'?'#a20000':(person.compnayName === 'BlueCross'?'#01aef0':'#00a850'))}; text-align:left;">
																<p style="font-family:Arial; color:#fff; font-weight:700; text-align:center">
																	${person.linkUrls && person.linkUrls.policyWording &&
																		`<a href= ${S3_URL}${person.linkUrls.policyWording}
																			target="_blank"
																			style="text-decoration:none; text-align:center; color:#fff;">
																			<span style="text-decoration:underline; padding:5px">
																			${trans.PolicyWording?trans.PolicyWording:'Policy Wording'}</span>
																			</a> `
																	}	
																</p>
															</td>
															<td style="padding-top:10pt; padding-bottom:10pt; vertical-align:middle; 
																background-color:${person.compnayName === 'Tugo' ? '#00c7b2':(person.compnayName === 'Allianz'?'#a20000':(person.compnayName === 'BlueCross'?'#01aef0':'#00a850'))}; text-align:left;">
																<p style="font-family:Arial; color:#fff; font-weight:700; text-align:center">
																	${person.linkUrls && person.linkUrls.howtoClaim &&
																		`<a href= ${S3_URL}${person.linkUrls.howtoClaim}
																			target="_blank"
																			style="text-decoration:none; text-align:center; color:#fff;">
																			<span style="text-decoration:underline; padding:5px">
																			${trans.HowToClaim?trans.HowToClaim:'How to Claim'}</span>
																			</a> `
																	}		
																</p>
															</td>
														</tr>
													</table>
												</td>
											</tr>
											

											`
											)).join('')}




											<tr>
												<td style="vertical-align:top">
													<table style="width:100%; border-collapse:collapse;  border-color:#ffffff">
														<tr style="height:13.5pt">
															<td style="vertical-align:middle; background-color:#ffffff">
																<p><span
																		style="font-family:Arial; -aw-import:ignore">&#xa0;</span>
																</p>
															</td>
														</tr>
													</table>
													<p></p>
												</td>
											</tr>


											${data.insuredpersons.some(person => person.compnayName === 'BlueCross') ?
												`
												<tr>
													<td style="vertical-align:top">
														<table style="width:100%; border-collapse:collapse;  border-color:#ffffff">
															<tr>
																<td
																	style="padding:4.5pt 12.25pt; vertical-align:middle; text-align:center; background-color:#ffffff; margin-bottom:30px;">
																	<p style="margin-top:30px;"><span
																			style="font-family:Arial; font-weight:bold; color:#2a2f71; font-size:16px; margin-bottom:15px;">${trans.CAA_BlueCrossFlightDelayTitle?trans.CAA_BlueCrossFlightDelayTitle:'Flight Delay Service At no extra cost'}</span>
																	</p>
																	<p style="margin-bottom:15px;"><span
																			style="font-family:Arial; color:#000; font-size:14px;">${trans.CAA_BlueCrossFlightDelayDescription?trans.CAA_BlueCrossFlightDelayDescription:'Depending on the duration of your flight delay, you may be eligible for additional coverage. If your flight is delayed by more than 3 hours, you can get additional guarantees such as airport lounge access or $40/person compensation. If the delay exceeds 6 hours, you may be eligible for a hotel room with compensation up to $250 or $250 compensation plus an additional $50/person. To enjoy this benefit, please ensure that you register by clicking the `Register Now` button before your departure.'}</span>
																	</p>
																	<p><span
																			style="font-family:Arial; color:red; font-size:12px;">${trans.CAA_BlueCrossFlightDelaySub?trans.CAA_BlueCrossFlightDelaySub:'*This benefit is exclusively available for travelers with BlueCross coverage.'}
																	</span></p>
																</td>
															</tr>
														</table>
														<p></p>
													</td>
												</tr>
												<tr>
													<td style="vertical-align:top; margin-bottom:15px;">
														<table style="width:100%; border-collapse:collapse;  border-color:#ffffff;">
															<tr>
																<td style="padding-top:10pt; padding-bottom:10pt; vertical-align:middle; 
																	background-color:#01aef0; text-align:left;">
																	<p style="font-family:Arial; color:#fff; font-weight:700; text-align:center">
																		<a href= ${data.prefer_language === 'ko' ? 
																					'https://stonewell-bucket.s3.ca-central-1.amazonaws.com/Brochures/BlueCross-Flight_Delay_Service-Brochure_Korean.pdf'
																				 	: 'https://stonewell-bucket.s3.ca-central-1.amazonaws.com/Brochures/BlueCross-Flight_Delay_Service-Brochure_English.pdf'
																				 }
																			target="_blank"
																			style="text-decoration:none; text-align:center; color:#fff;">
																			<span style="text-decoration:underline; padding:5px">
																			${trans.CAA_SeeDetail?trans.CAA_SeeDetail:'See Detail'}</span>
																		</a> 
																	</p>
																</td>
																
																<td style="padding-top:10pt; padding-bottom:10pt; vertical-align:middle; 
																background-color:#01aef0; text-align:left;">
																	<p style="font-family:Arial; color:#fff; font-weight:700; text-align:center">
																		<a href= 'https://www.flightdelayservice.ca/'
																			target="_blank"
																			style="text-decoration:none; text-align:center; color:#fff;">
																			<span style="text-decoration:underline; padding:5px">
																			${trans.CAA_RegisterNow?trans.CAA_RegisterNow:'Register Now'}</span>
																		</a> 	
																	</p>
																</td>
															</tr>
														</table>
													</td>
												</tr>
												`
												:``
											}

											<tr>
												<td style="vertical-align:top">
													<table style="width:100%; border-collapse:collapse;  border-color:#ffffff">
														<tr style="height:13.5pt">
															<td style="vertical-align:middle; background-color:#ffffff">
																<p><span
																		style="font-family:Arial; -aw-import:ignore">&#xa0;</span>
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
																style="border-bottom:1pt solid #f0f0f0; padding:4.5pt 12.25pt; vertical-align:middle; background-color:#ffffff">
																<p><span
																		style="font-family:Arial; font-weight:bold; color:#2a2f71">
																		${trans.ContactInfo?trans.ContactInfo:'Contact'}</span>
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
																style="padding:4.5pt 12.25pt; vertical-align:middle; background-color:#fcfcfc">
																<table style="width:100%; border-collapse:collapse;  border-color:#ffffff; float:left">
																	<tr>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span
																					style="font-family:Arial; color:#434343">&#xa0;</span><span
																					style="font-family:Arial; color:#434343">${trans.Phone?trans.Phone:'Phone'}</span></p>
																		</td>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span style="font-family:Arial; color:#434343">${data.phone}</span></p>
																		</td>
																	</tr>
																	<tr>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span
																					style="font-family:Arial; color:#434343">&#xa0;</span><span
																					style="font-family:Arial; color:#434343">
																					${trans.MailingAddress?trans.MailingAddress:'Mailing Address'}</span><span
																					style="font-family:Arial; color:#434343">&#xa0;</span>
																			</p>
																		</td>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p>
																				<span style="font-family:Arial; color:#434343">
																					${data.address.filter(f=>f.useType === 'Mailling').map(a => (
																						`
																						${a.street} ${a.suiteNo} <br>
																						${a.city} ${a.province} <br>
																						${a.postalcode} ${a.country}
																						`
																					))}
																				</span>
																			</p>
																		</td>
																	</tr>
																	<tr>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span
																					style="font-family:Arial; color:#434343">&#xa0;</span><span
																					style="font-family:Arial; font-weight:bold; color:#434343">
																					${trans.CAA_Agency?trans.CAA_Agency:'Agency'}</span>
																			</p>
																		</td>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span
																					style="font-family:Arial; font-size:10pt; font-weight:bold; color:#434343">&#xa0;</span><span
																					style="font-family:Arial; font-weight:bold; color:#434343">${data.vendor_name}</span></p>
																		</td>
																	</tr>
																</table>
																<p style="font-size:10pt"></p>
															</td>
														</tr>
													</table>
													<p></p>
												</td>
											</tr>
											<tr>
												<td style="vertical-align:top">
													<table style="width:100%; border-collapse:collapse;  border-color:#ffffff">
														<tr style="height:9.75pt">
															<td style="vertical-align:middle; background-color:#ffffff">
																<p><span
																		style="font-family:Arial; -aw-import:ignore">&#xa0;</span>
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
														<tr style="height:13.5pt">
															<td style="vertical-align:middle; background-color:#ffffff">
																<p><span
																		style="font-family:Arial; -aw-import:ignore">&#xa0;</span>
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
																style="border-bottom:1pt solid #f0f0f0; padding:4.5pt 12.25pt; vertical-align:middle; background-color:#ffffff">
																<p><span
																		style="font-family:Arial; font-weight:bold; color:#434343">
																		${trans.RefundPolicyTitle?trans.COA_RefundPolicyTitle:'Refund Policy'}</span>
																</p>
															</td>
														</tr>
													</table>
													<p></p>
												</td>
											</tr>

											<tr>
												<td style="vertical-align:top">
													${data.travel_direction_type==='OutBound'?
												     `
													 <table style="width:100%; border-collapse:collapse;  border-color:#ffffff">
														<tr>
															<td
																style="padding:4.5pt 12.25pt; vertical-align:middle; background-color:#ffffff">
																<p><span
																		style="font-family:Arial; color:#434343; font-size:12px">
																		${trans.COA_RefundPolicyOutbound?trans.COA_RefundPolicyOutbound:'Refunds before the start date of the insurance policy are only possible within 10 days of purchasing. Refunds will be issued only if the refund amount exceeds the minimum refundable amount. For refunds requested after the insurance start date, proof of not undertaking the trip must be submitted to the insurance company. Stonewell fees and insurance company fees will be charged separately when initiating a refund.'}</span>
																</p>
															</td>
														</tr>
													</table>
													 `
													:`
														<table style="width:100%; border-collapse:collapse;  border-color:#ffffff">
															<tr>
																<td
																	style="padding:4.5pt 12.25pt; vertical-align:middle; background-color:#ffffff">
																	<p>
																		<span style="font-family:Arial; color:#434343; font-size:12px">
																			${trans.COA_RefundPolicyInbound?trans.COA_RefundPolicyInbound:'Partial refunds after the effective date of the insurance policy are possible if the following conditions are met. Stonewell fees and insurance company fees will be imposed separately when initiating a refund.'}
																		</span>
																	</p>
																	<ul style="font-family:Arial; color:#434343; font-size:12px">
																		<li>${trans.COA_RefundPolicyInboundConditionTitle?trans.COA_RefundPolicyInboundConditionTitle:'Conditions:'}
																			<ol>
																			<li>${trans.COA_RefundPolicyInboundCondition1?trans.COA_RefundPolicyInboundCondition1:'There have been no attempts to make an insurance claim, regardless of coverage.'}</li>
																			<li>${trans.COA_RefundPolicyInboundCondition2?trans.COA_RefundPolicyInboundCondition2:'The refund amount must exceed the minimum eligible refund amount.'}</li>
																			<li>${trans.COA_RefundPolicyInboundCondition3?trans.COA_RefundPolicyInboundCondition3:'Refund requests must be made within 30 days from the insurance policy expiration date.'}</li>
																			<li>${trans.COA_RefundPolicyInboundCondition4?trans.COA_RefundPolicyInboundCondition4:'If the insurance policy was submitted for visa or school registration purposes, the refund request details must be communicated to the respective institution.'}</li>
																			</ol>
																		</li>
																		<li>${trans.COA_RefundPolicyInboundCaseTitle?trans.COA_RefundPolicyInboundCaseTitle:'Partial refunds are only possible in the following cases:'}
																			<ol>
																			<li>${trans.COA_RefundPolicyInboundCase1?trans.COA_RefundPolicyInboundCase1:'Permanent return to the home country.'}</li>
																			<li>${trans.COA_RefundPolicyInboundCase2?trans.COA_RefundPolicyInboundCase2:'Eligibility for government health insurance benefits.'}</li>
																			</ol>
																		</li>
																	</ul>
																</td>
															</tr>
														</table>
													`}
												</td>
											</tr>
											
											
											<tr>
												<td style="vertical-align:top">
													<table style="width:100%; border-collapse:collapse;  border-color:#ffffff">
														<tr style="height:20.25pt">
															<td style="vertical-align:middle; background-color:#ffffff">
																<p><span
																		style="font-family:Arial; -aw-import:ignore">&#xa0;</span>
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
														<tr style="height:10.5pt">
															<td style="vertical-align:middle; background-color:#ffffff">
																<p><span
																		style="font-family:Arial; -aw-import:ignore">&#xa0;</span>
																</p>
															</td>
														</tr>
													</table>
													<p></p>
												</td>
											</tr>
											
											
										</table>
										<p></p>
									</td>
								</tr>
							</table>
							<p style="font-size:10pt"></p>
						</td>
					</tr>
				</table>
				<p><span style="-aw-import:ignore">&#xa0;</span></p>
			</div>
		</body>
		
		</html>
		`
	)}

module.exports = {approvedConfirmation}
