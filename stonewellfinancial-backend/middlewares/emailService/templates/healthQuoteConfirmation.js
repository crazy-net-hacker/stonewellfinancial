const healthQuoteConfirmation = (data, trans) => {

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

								
											<tr>
												<td style="vertical-align:top">
													<table style="width:100%; border-collapse:collapse;  border-color:#ffffff">
														<tr>
															<td
																style="border-bottom:1pt solid #f0f0f0; padding:4.5pt 12.25pt; vertical-align:middle; background-color:#ffffff">
																<p><span
																		style="font-family:Arial; font-weight:bold; color:#2a2f71">${trans.Applicant?trans.Applicant:'Applicant'}</span>
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
													${data.insuredpersons.map((person, index) => (
													index === 0 
													?
													
													`
														<tr>
														<td
															style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
															<p><span
																style="font-family:Arial; color:#434343">${trans.Name}
															</span><br />
															</p>
														</td>
														<td
															style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
															<p><span
																style="font-family:Arial; font-weight:bold; color:#434343">${person.firstName} ${person.lastName}</span>
															</p>
														</td>
														</tr>
														<tr>
														<td
															style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
															<p><span
																style="font-family:Arial; color:#434343">${trans.COA_DOB}
															</span><br />
															</p>
														</td>
														<td
															style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
															<p><span
																style="font-family:Arial; font-weight:bold; color:#434343">${person.birthDate}</span>
															</p>
														</td>
														</tr>
														<tr>
														<td
															style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
															<p><span
																style="font-family:Arial; color:#434343">${trans.COA_Gender}
															</span><br />
															</p>
														</td>
														<td
															style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
															<p><span
																style="font-family:Arial; font-weight:bold; color:#434343">${person.gender}</span>
															</p>
														</td>
														</tr>
														<tr>
														<td
															style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
															<p><span
																style="font-family:Arial; color:#434343">${trans.CAA_SmokeStatus}
															</span><br />
															</p>
														</td>
														<td
															style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
															<p><span
																style="font-family:Arial; font-weight:bold; color:#434343">${person.smokeStatus===true?'Yes':'No'}</span>
															</p>
														</td>
														</tr>
														<tr>
														<td
															style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
															<p><span
																style="font-family:Arial; color:#434343">${trans.CAA_HealthStatus}
															</span><br />
															</p>
														</td>
														<td
															style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
															<p><span
																style="font-family:Arial; font-weight:bold; color:#434343">${person.healthStatus}</span>
															</p>
														</td>
														</tr>
							
													`
													:``
													)).join('')
													}

									<tr>
                                      <td
                                        style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                        <p><span
                                            style="font-family:Arial; color:#434343">${trans.CAA_Province}
                                          </span><br />
                                        </p>
                                      </td>
                                      <td
                                        style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                        <p><span
                                            style="font-family:Arial; font-weight:bold; color:#434343">${data.province}</span>
                                        </p>
                                      </td>
                                    </tr>



                                  ${data.insuranceKind !== 'Personal' 
                                  ?
                                  `
                                  <tr>
										<td
											style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
											<p><span
													style="font-family:Arial; color:#434343">${trans.HQC_FamilyIllnessHistoryQuestion?trans.HQC_FamilyIllnessHistoryQuestion:'Family critical illness history'}
												</span><br />
											</p>
										</td>
										<td
											style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
											<p><span
													style="font-family:Arial; font-weight:bold; color:#434343">${data.familyIllnessHistory===true?'Yes':'No'}</span>
											</p>
										</td>
									</tr>
                                  ${data.familyIllnessHistory == true 
                                    ?
                                    `
                                    <tr>
                                      <td
                                        style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                        <p><span
                                            style="font-family:Arial; color:#434343">${trans.HQC_FamilyAge}
                                          </span><br />
                                        </p>
                                      </td>
                                      <td
                                        style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                        <p><span
                                            style="font-family:Arial; font-weight:bold; color:#434343">${data.ageIllness}</span>
                                        </p>
                                      </td>
																	  </tr>
                                    <tr>
                                      <td
                                        style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                        <p><span
                                            style="font-family:Arial; color:#434343">${trans.HQC_IllnessName}
                                          </span><br />
                                        </p>
                                      </td>
                                      <td
                                        style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                        <p><span
                                            style="font-family:Arial; font-weight:bold; color:#434343">${data.nameIllness}</span>
                                        </p>
                                      </td>
																	  </tr>
                                    `
                                  :``}
                                  `
                                  :
                                  ``
                                  }

                                  ${data.insuranceKind === 'Disability' 
                                    ?
                                    `
                                      <tr>
                                        <td
                                          style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                          <p><span
                                              style="font-family:Arial; color:#434343">${trans.HQC_AnnualIncome}
                                            </span><br />
                                          </p>
                                        </td>
                                        <td
                                          style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                          <p><span
                                              style="font-family:Arial; font-weight:bold; color:#434343">${parseFloat(data.annualIncome).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0 })}</span>
                                          </p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                          <p><span
                                              style="font-family:Arial; color:#434343">${trans.HQC_Occupation}
                                            </span><br />
                                          </p>
                                        </td>
                                        <td
                                          style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                          <p><span
                                              style="font-family:Arial; font-weight:bold; color:#434343">${data.occupation}</span>
                                          </p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                          <p><span
                                              style="font-family:Arial; color:#434343">${trans.HQC_RoleAtWork}
                                            </span><br />
                                          </p>
                                        </td>
                                        <td
                                          style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                          <p><span
                                              style="font-family:Arial; font-weight:bold; color:#434343">${data.roleAtWork}</span>
                                          </p>
                                        </td>
                                      </tr>
                                    `
                                    :``
                                  }

                                  ${data.insuranceKind === 'Personal' 
                                    ?
                                    `
                                    ${data.insuredpersons.map((person, index) => (
                                      index === 0 
                                      ?
                                      ``
                                      :
                                      `
                                        <tr>
                                          <td style="vertical-align:top">
                                            <table style="width:100%; border-collapse:collapse;  border-color:#ffffff">
                                              <tr>
                                                <td
                                                  style="border-bottom:1pt solid #f0f0f0; padding:3.75pt; vertical-align:middle; background-color:#ffffff">
                                                  <p><span
                                                      style="font-family:Arial; font-weight:bold; color:#2a2f71">${person.relationship}</span>
                                                  </p>
                                                </td>
                                              </tr>
                                            </table>
                                            <p></p>
                                          </td>
                                        </tr>

                                        <tr>
                                          <td
                                            style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                            <p><span
                                                style="font-family:Arial; color:#434343">${trans.Name}
                                              </span><br />
                                            </p>
                                          </td>
                                          <td
                                            style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                            <p><span
                                                style="font-family:Arial; font-weight:bold; color:#434343">${person.firstName} ${person.lastName}</span>
                                            </p>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                            <p><span
                                                style="font-family:Arial; color:#434343">${trans.DOB}
                                              </span><br />
                                            </p>
                                          </td>
                                          <td
                                            style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                            <p><span
                                                style="font-family:Arial; font-weight:bold; color:#434343">${person.birthDate}</span>
                                            </p>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                            <p><span
                                                style="font-family:Arial; color:#434343">${trans.COA_Gender}
                                              </span><br />
                                            </p>
                                          </td>
                                          <td
                                            style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                            <p><span
                                                style="font-family:Arial; font-weight:bold; color:#434343">${person.gender}</span>
                                            </p>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                            <p><span
                                                style="font-family:Arial; color:#434343">${trans.CAA_SmokeStatus}
                                              </span><br />
                                            </p>
                                          </td>
                                          <td
                                            style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                            <p><span
                                                style="font-family:Arial; font-weight:bold; color:#434343">${person.smokeStatus===true?'Yes':'No'}</span>
                                            </p>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                            <p><span
                                                style="font-family:Arial; color:#434343">${trans.CAA_HealthStatus}
                                              </span><br />
                                            </p>
                                          </td>
                                          <td
                                            style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                            <p><span
                                                style="font-family:Arial; font-weight:bold; color:#434343">${person.healthStatus}</span>
                                            </p>
                                          </td>
                                        </tr>
                                        

                                      `
                                      )).join('')
                                    }
                                    `
                                    :``
                                    }
																</table>
																
															</td>
														</tr>
													</table>
													
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
																		style="font-family:Arial; font-weight:bold; color:#2a2f71">
																		${trans.Product?trans.Product:'Product'}</span>
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
																					style="font-family:Arial; color:#434343">
																					${trans.InsuranceType?trans.InsuranceType:'Insurance Type'}</span>
																			</p>
																		</td>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span style="font-family:Arial; color:#434343">${data.insuranceKindDesc}</span></p>
																		</td>
																	</tr>
                                  ${data.insuranceKind === 'Critical'?
                                  `
                                    <tr>
                                      <td
                                        style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                        <p><span
                                            style="font-family:Arial; color:#434343">
                                            ${trans.ProductType?trans.ProductType:'Product Type'}</span>
                                        </p>
                                      </td>
                                      <td
                                        style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                        <p><span style="font-family:Arial; color:#434343">${data.productTypeDesc} - ${data.productKindDesc}</span></p>
                                      </td>
                                    </tr>
                                  
                                    <tr>
                                      <td
                                        style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                        <p><span
                                            style="font-family:Arial; color:#434343">
                                            ${trans.BenefitAmount?trans.BenefitAmount:'Benefit Amount'}</span>
                                        </p>
                                      </td>
                                      <td
                                        style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                                        <p>
                                          <span style="font-family:Arial; color:#434343">
                                          ${parseFloat(data.benefitAmount).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0 })}
                                          </span>
                                        </p>
                                      </td>
                                    </tr>
                                  `
                                  :``}
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
																					style="font-family:Arial; color:#434343">
																					${trans.Phone?trans.Phone:'Phone'}</span>
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
																					style="font-family:Arial; color:#434343">
																					${trans.Email?trans.Email:'Email'}</span>
																		</td>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p>
																				<span style="font-family:Arial; color:#434343">
                                        ${data.email}
																				</span>
																			</p>
																		</td>
																	</tr>
                                  <tr>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p><span
																					style="font-family:Arial; color:#434343">
																					${trans.ContactMethod?trans.ContactMethod:'Preferable'}</span>
																			</p>
																		</td>
																		<td
																			style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
																			<p>
																				<span style="font-family:Arial; color:#434343">
                                        ${data.contactMethod}
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
    )}


module.exports = {healthQuoteConfirmation}