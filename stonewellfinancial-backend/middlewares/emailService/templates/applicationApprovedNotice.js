module.exports = {
  letterMailOptions(data) {
    return new Promise((resolve) => {
      let sendInfo = data

      const mailOption = {
        from: {name:'Stonewell Financial', 
              address: process.env.MAIL_USER},
        to: sendInfo.vendor_email !== 'info@stonewellfinancial.com' ? sendInfo.vendor_email : 'sales@stonewellfinancial.com',
        // bcc: sendInfo.bcc?['sales@stonewellfinancial.com', sendInfo.bcc]:'sales@stonewellfinancial.com',
        // bcc: sendInfo.bcc,
        subject: `Application approved`,
        html: `
        <div>
          <p>Hello ${data.vendor_name},</p>
          <br>
          <p>Congratulation! Your application has been accepted.</p>
          <p>Client Detail:</p>
          ${data.insuredpersons.map(person => (
            `
            <p>${person.firstName} ${person.lastName} (${person.age} yrs) </p>
            `)).join('')
          }
          <br>
          <p>Note:</P>
          ${data.remark?`${data.remark.replace(/\r?\n/g, '<br />')}`: `N/A`}

          <br>
          <br>
          <p>To view details , Please click here : </p>
          <p>Application Search URL: <a href="https://www.stonewellfinancial.com/myportal/vendor/search-application?id=${data.application_id}">https://www.stonewellfinancial.com/myportal/vendor/search-application?id=${data.application_id}</a></p>
        </div>
            `,
      }
      resolve(mailOption)
    })
  },
}

