module.exports = {
    policyToClient(data) {
      return new Promise((resolve) => {
        let sendInfo = data
        const mailOption = {
          from: {name:'Stonewell Financial', 
                address: process.env.MAIL_USER},
          to: sendInfo.to,
          bcc: sendInfo.bcc?['sales@stonewellfinancial.com', sendInfo.bcc]:'sales@stonewellfinancial.com',
          subject: `Policy Declaration`,
          attachments: sendInfo.mailAttachedFile ,
          html: `
          <div>
            <p><strong>Hello, </strong></p>
            <p>Please see the attached file(s).</p>
            <p>Thanks.</p>
            <br/>
            <br/>
            <p>Stonewell Financial</p>
          </div>
              `,
        }
        resolve(mailOption)
      })
    },
  }