module.exports = {
  letterMailOptions(data) {
    return new Promise((resolve) => {

      const mailOption = {
        from: {name:'Stonewell Financial', 
              address: process.env.MAIL_USER},
        to: 'sales@stonewellfinancial.com',
        subject: `${data.vendor_name} - Vendor information [Updated]`,
        html: `
        <div>
          <p>Vendor Name: ${data.vendor_name}</P>
          <p>Above vendor information has been updated.</p>
        </div>
            `,
      }
      resolve(mailOption)
    })
  },
}

