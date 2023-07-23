module.exports = {
  letterMailOptions(data) {
    return new Promise((resolve) => {

      const mailOption = {
        from: {name:'Stonewell Financial', 
              address: process.env.MAIL_USER},
        to: 'sales@stonewellfinancial.com',
        subject: `New Vendor Application - ${data.companyName}`,
        html: `
              <table style="border-collapse: collapse; width:100%">
                    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Company Name</td>
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.companyName}</td>
                    </tr>
                    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Type</td>
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.vendorType}</td>
                    </tr>
                    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Main Job</td>
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.vendorJob}</td>
                    </tr>
                    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">The number of estimated clients per year</td>
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.estimatedClientNumber}</td>
                    </tr>
                    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Client's Province</td>
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.clientProvince}</td>
                    </tr>
                    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Office in Canada?</td>
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.officeInCanada}</td>
                    </tr>
                    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Mailing in Canada?</td>
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.MailingInCanada}</td>
                    </tr>
                    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Address</td>
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.street} ${data.suiteNo}, ${data.city} ${data.province} ${data.postalCode} ${data.country}</td>
                    </tr>
                    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Applicant's Name</td>
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.lastName} ${data.firstName}</td>
                    </tr>
                    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Applicant's Email</td>
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.email}</td>
                    </tr>
                    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Is the applicant a manager?</td>
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.IsManager}</td>
                    </tr>
                    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">The number of employees in charge of insurance</td>
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.employeeNumber}</td>
                    </tr>
                    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Special Note</td>
                      <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.note}</td>
                    </tr>
                </table>
                <p>Check here: <a href="https://www.stonewellfinancial.com/myportal/admin/vendor-register">See all vendor account</a></p>
            `,
      }
      resolve(mailOption)
    })
  },
}

