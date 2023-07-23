module.exports = {
  letterMailOptions(data) {
    return new Promise((resolve) => {
      const mailOption = {
        from: {name:'Stonewell Financial', 
              address: process.env.MAIL_USER},
        to: data.creatorEmail,
        bcc: 'sales@stonewellfinancial.com',
        subject: `Application Returned`,
        html: `
        <div>
          <p>Hello ${data.creatorFullName},</p>
          <br>
          <p>Your application is sent back to you to modify and submit again.</p>
          <br>
          <p><span style="color:red;">Reason</span></p>
          <p><span style="color:red;">${data.remark.replace(/\r?\n/g, '<br />')}</span></p>

          <br>
          <p>Please click here on the URL mentioned below and adjust your application to meet our criteria</p>
          <p>Application Search URL: <a href="https://www.stonewellfinancial.com/myportal/vendor/search-application?id=${data.application_id}">https://www.stonewellfinancial.com/myportal/vendor/search-application?id=${data.application_id}</a></p>
          <p>if you have problems, please paste the above URL into your web browser.</p>

        </div>
            `,
      }
      resolve(mailOption)
    })
  },
}

