const refundRequestConfirmation = (data, trans) => {

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
																style="border-bottom:1pt solid #f0f0f0; padding:4.5pt 0; vertical-align:middle; background-color:#ffffff">
																<p><span
																		style="font-family:Arial; font-weight:bold; color:#2a2f71">${person.firstName} ${person.lastName}</span>
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
                              style="font-family:Arial; color:#434343">${trans.CRR_RequestedDate?trans.CRR_RequestedDate:'Date'}
                            </span><br />
                          </p>
                        </td>
                        <td
                          style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                          <p><span
                              style="font-family:Arial; font-weight:bold; color:#434343">${data.requestDate.toLocaleDateString('en-CA', { day: 'numeric', month: 'short', year: 'numeric'})}</span>
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                          <p><span
                              style="font-family:Arial; color:#434343">${trans.CRR_Company?trans.CRR_Company:'Company'}
                            </span><br />
                          </p>
                        </td>
                        <td
                          style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                          <p><span
                              style="font-family:Arial; font-weight:bold; color:#434343">${person.insuranceCompany}</span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                          <p><span
                              style="font-family:Arial; color:#434343">Policy Number
                            </span><br />
                          </p>
                        </td>
                        <td
                          style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                          <p><span
                              style="font-family:Arial; font-weight:bold; color:#434343">${person.policyNumber}</span>
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                          <p><span
                              style="font-family:Arial; color:#434343">${trans.CRR_RefundReson?trans.CRR_RefundReson:'The reason'}
                            </span><br />
                          </p>
                        </td>
                        <td
                          style="padding-top:3.75pt; padding-bottom:3.75pt; vertical-align:top; background-color:#fcfcfc">
                          <p><span
                              style="font-family:Arial; font-weight:bold; color:#434343">${data.reason}</span>
                          </p>
                        </td>
                      </tr>
                      `
                      ))}
											

											
											<tr>
												<td>
													<table style="width:100%; border-collapse:collapse;  border-color:#ffffff">
														<tr>
															<td style="vertical-align:middle; background-color:#ffffff;  width:100%;">
																<p style="margin-top:50px;"><span
																		style="font-family:Arial; font-size:16px; -aw-import:ignore">${trans.CRR_Thankyou}</span>
																</p>
															</td>
														</tr>
													</table>
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


module.exports = {refundRequestConfirmation}