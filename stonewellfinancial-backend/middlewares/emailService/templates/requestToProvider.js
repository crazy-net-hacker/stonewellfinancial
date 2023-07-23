module.exports = {
    refundRequestToProvider(data) {
      
      return new Promise((resolve) => {
        let sendInfo = data
        const mailOption = {
          from: {name:'Stonewell Financial', 
                address: process.env.MAIL_USER},
          // to: sendInfo.providerEmail,
          // to: `samantha@stonewellfinancial.com`,
          to: `nicejsl99@gmail.com`,
          // bcc: 'sales@stonewellfinancial.com',
          subject: `${sendInfo.policyNum} - Refund Request`,
          attachments: sendInfo.mailAttachedFile ,
          html: `
          <div>
            <p><strong>Hello, ${sendInfo.providerEmail}  </strong></p>
            <p>Please see the signed refund form.</p>
            <p>Thanks.</p>
            <br/>
            <br/>
            <p>Andrew Lee</p>
            <p>Stonewell Financial</p>
          </div>
              `,
        }
        resolve(mailOption)
      })
    },
  }