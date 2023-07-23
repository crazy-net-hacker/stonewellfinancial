const paymentConfirmation = (data, trans) => {

	// amount Format 
	function amountFormat(amount, decimal) {
		return (
			parseFloat(amount).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: decimal })
		)
	}

	return (
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
																	style="border-bottom:1pt solid #f0f0f0; padding:4.5pt; vertical-align:middle; background-color:#ffffff">
																	<p><span
																			style="font-family:Arial; font-weight:bold; color:#2a2f71">${trans.Relationship && trans.Relationship.filter(f => f.code === person.relationship).length > 0 ? trans.Relationship.filter(f => f.code === person.relationship)[0].name : person.relationship}</span>
																	</p>
																</td>
															</tr>
														</table>
														<p></p>
													</td>
												</tr>
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
																style="font-family:Arial; color:#434343">${trans.COA_Insurance ? trans.COA_Insurance : 'Insurance'}
															</span><br />
														</p>
													</td>
													<td
														style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
														<p><span
																style="font-family:Arial; font-weight:bold; color:#434343">${person.compnayName}  ${person.planName}</span>
														</p>
													</td>
												</tr>

												<tr>
													<td
														style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
														<p><span
															style="font-family:Arial; color:#434343">${trans.BenefitAmount ? trans.BenefitAmount : 'Benefit Amount'}
														</span><br />
														</p>
													</td>
													<td
														style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
														<p><span
															style="font-family:Arial; font-weight:bold; color:#434343">${amountFormat(person.coverage, 0)}</span>
														</p>
													</td>
													</tr>

												<tr>
												<td
													style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
													<p><span
														style="font-family:Arial; color:#434343">${trans.Deductible ? trans.Deductible : 'Deductible'}
													</span><br />
													</p>
												</td>
												<td
													style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
													<p><span
														style="font-family:Arial; font-weight:bold; color:#434343">${amountFormat(person.deductible, 0)}</span>
													</p>
												</td>
												</tr>

												<tr>
												<td
												style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
												<p><span
													style="font-family:Arial; color:#434343">${trans.COA_OptionalPlan ? trans.COA_OptionalPlan : 'Optional Plan'}
													</span><br />
												</p>
												</td>
												<td
												style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
												<p><span
													style="font-family:Arial; font-weight:bold; color:#434343">
													${person.optionPlan && person.optionPlan.map((op, opIndex) => (
								`
														${op.optionPlanName}
														${person.optionPlan.length > opIndex ? `<br/>` : ``}
													
														<span style="font-size:12px;color:#979797;">
															&nbsp; &nbsp; &nbsp;  ${amountFormat(op.optionPlanCoverage, 0)} coverage 
														</span>
														<br/>
														`
													)).join('')
													}
													${person.optionPlan.length === 0 ? `Not Purchased`:``}
									</span>
                                  </p>
                                </td>
                              </tr>

                              <tr>
                              <td
                                style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                <p><span
                                    style="font-family:Arial; color:#434343">${trans.COA_Services ? trans.COA_Services : 'Services'}
                                  </span><br />
                                </p>
                              </td>
                              <td
                                style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                <p><span
                                    style="font-family:Arial; font-weight:bold; color:#434343">${person.carewellServiceAmount === 0 ? `Not Purchased` : `${person.carewellService}`}</span>
                                </p>
                              </td>
                            </tr>

                            <tr>
                              <td
                                style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                <p><span
                                    style="font-family:Arial; color:#434343">${trans.COA_CoverageDays ? trans.COA_CoverageDays : 'Coverage days'}
                                  </span><br />
                                </p>
                              </td>
                              <td
                                style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                <p><span
                                    style="font-family:Arial; font-weight:bold; color:#434343">${person.tripStartDate} ~ ${person.tripEndDate} (${person.tripPeriod} days)</span>
                                </p>
                              </td>
                            </tr>

                            <tr>
                            <td
                              style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                              <p><span
                                  style="font-family:Arial; color:#434343">${trans.COA_TotalPremium ? trans.COA_TotalPremium : 'Total'}
                                </span><br />
                              </p>
                            </td>
                            <td
                              style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                              <p><span
                                  style="font-family:Arial; font-weight:bold; color:#434343">${amountFormat(person.totalAmount, 2)}</span>
                              </p>
                            </td>
                          </tr>
                                
                                 
                            `
		)).join('')}

                            ${data.family_plan_amount > 0 ? `
                            <tr>
                              <td
                                style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                <p><span
                                    style="font-family:Arial; color:#434343">${trans.COA_TotalPremium ? trans.COA_TotalPremium : 'Total'}
                                  </span><br />
                                </p>
                              </td>
                              <td
                                style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                <p><span
                                    style="font-family:Arial; font-weight:bold; color:#434343">${amountFormat((parseFloat(data.total_amount) + parseFloat(data.family_plan_discount)), 2)}</span>
                                </p>
                              </td>
                            </tr>

                            <tr>
                              <td
                                style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                <p><span
                                    style="font-family:Arial; color:#434343">${trans.DPC_FamilyDiscount ? trans.DPC_FamilyDiscount : 'Family Discount'}
                                  </span><br />
                                </p>
                              </td>
                              <td
                                style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                <p><span
                                    style="font-family:Arial; font-weight:bold; color:#434343">${amountFormat(data.family_plan_discount, 2)}</span>
                                </p>
                              </td>
                            </tr>
                            `: ``}

															

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
																		${trans.COP_PaymentConfirmed ? trans.COP_PaymentConfirmed : "Payment Information"}</span>
																</p>
															</td>
														</tr>
													</table>
													<p></p>
												</td>
											</tr>
											<tr style="width:100%;>
												<td style="vertical-align:top;">
													<table style="width:100%; border-collapse:collapse;  border-color:#ffffff">
														<tr>
															<td
																style="padding:4.5pt 12.25pt; vertical-align:middle; background-color:#fcfcfc">
																<table style="width:100%; border-collapse:collapse;  border-color:#ffffff; float:left">
																	<tr>
																		<td
																		style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																		<p><span
																			style="font-family:Arial; color:#434343">${trans.COP_YourTotal ? trans.COP_YourTotal : 'Your Total'}
																			</span><br />
																		</p>
																		</td>
																		<td
																		style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																		<p><span
																			style="font-family:Arial; font-weight:bold;  color:#2a2f71">${amountFormat(data.total_amount, 2)}</span>
																		</p>
																		</td>
																	</tr>

																	<tr>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span
																				style="font-family:Arial; color:#434343">${trans.COA_PaymentMethod ? trans.COA_PaymentMethod : 'Method'}
																			</span><br />
																			</p>
																		</td>
																	<td
																		style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																		<p><span
																			style="font-family:Arial; font-weight:bold;  color:#2a2f71">  
																			${data.payment[0].paymentMethod === 'Creditcard' && data.payment[0].PaymentBy !== 'Client' ? `<span style="font-size:16px;">${data.payment[0].creditCardType}</span>` : `<span style="font-size:16px;">${data.payment[0].paymentMethod}</span>`}
																			${data.payment[0].paymentMethod === 'E-transfer' ? `<p>Sender : ${data.payment[0].senderName}</p>` : ``}
																												<span style="color:#979797;"> 
																			${data.payment[0].creditCardNumber
																			? `<p>${'*'.repeat(data.payment[0].creditCardNumber.length - 4) + data.payment[0].creditCardNumber.substr(data.payment[0].creditCardNumber.length - 4, 4)} </p>`
																			: ``}
																			</span>
																		</p>
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
	)
}


module.exports = { paymentConfirmation }

