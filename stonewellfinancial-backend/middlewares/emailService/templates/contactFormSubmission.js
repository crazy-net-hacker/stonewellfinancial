module.exports = {
    formSubmissionMailOptions(data) {
        // console.log(process.env.MAIL_USER)
      var mailAttachmentList = [
        {
          filename: 'logo.png',
          path: `${__dirname}/logo.png`,
          cid: 'logo' 
        }
      ]

      return new Promise((resolve) => {
        let sendInfo = data
        const mailOption = {
          from: {name:'Stonewell Financial', 
                address: process.env.MAIL_USER},
          to: sendInfo.emailAdd,
          bcc: 'sales@stonewellfinancial.com',
          subject: `Thank you for contacting us.`,
          attachments: mailAttachmentList ,
          html: `
            <div>
            <table style="width: 90%; height: 676px; margin-left: auto; margin-right: auto;">
            <tbody>
            <tr style="height: 14.6406px; border-top: 2px solid black;">
            <td style="width: 100%; height: 14.6406px; border-left-style: hidden; border-right-style: hidden; border-bottom-style: hidden;" colspan="2" bgcolor="#FFFFFF"><a href="https://www.stonewellfinancial.com/" target="_blank" style="outline:none" tabindex="-1"><img style="width: 250px;" src="cid:logo" alt="logo" /></td>
            </tr>
            <tr style="height: 110px;">
            <td style="width: 100%; height: 110px; padding: 15px; border-left-style: hidden; border-right-style: hidden; border-bottom-style: hidden;" colspan="2">
            <p><span style="color: #0000ff;"><strong>Hello. ${sendInfo.firstName} ${sendInfo.lastName},</strong></span></p>
            <p>We've received your message. One of our representitives will contact you soon.</p>
            <p>If you need immediate assistance or have additional questions, please call us directly at <strong>1-833-645-3858</strong> and ask to speak with one of our licensed advisors.</p>
            <hr />
            <p>&nbsp;</p>
            <table style="width: 341.594px;">

            </table>
            <p><span style="color: #0000ff;"><strong>Your message</strong></span></p>
            <table style="width: 100%;">
            <tbody>
            <tr>
            <td style="width: 100%;">
            <pre>
            ${sendInfo.reqMessage}
            </pre>
            </td>

            </tr>
            </tbody>
            </table>

            <p>&nbsp;</p>
            <hr />

            <p>Privacy and security Legal Accessibility</p>
            <p>You have received this email because you provided your email address ${sendInfo.emailAdd} when requesting from us. To ensure delivery to your inbox (and not to your junk or bulk mail folders), add info@stonewellfinancial.com to your address book.</p>
            <p>&nbsp;</p>
            <div style="line-height: 150%; font-size: small;">Stonewell Financial Services INC<br />1-833-645-3858 (Toll-Free)<br />info@stonewellfinancial.com <br /><a href="http://www.stonewellfinancial.com">www.stonwellfinancial.com</a></div>
            <br /><br /></td>
            </tr>
            </tbody>
            </table>
            </div>
              `,
        }
  
        resolve(mailOption)
      })
    },
}