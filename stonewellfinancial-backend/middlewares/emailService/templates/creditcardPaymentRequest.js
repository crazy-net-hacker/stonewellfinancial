module.exports = {
  letterMailOptions(data) {
    // console.log(data)
    // amount Format 
    function amountFormat(amount, decimal)
    {
        return (
          parseFloat(amount).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: decimal })
        )
    }

    return new Promise((resolve) => {
      const mailOption = {
        from: {name:'Stonewell Financial', 
              address: process.env.MAIL_USER},
        to: 'sales@stonewellfinancial.com',
        subject: `Credit Card Payment`,
        html: `
        <div>

          <h3>Credit Card details</h3>
          <table style="border-collapse: collapse; width:100%">
              <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Name</td>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.lastName}, ${data.firstName}</td>
              </tr>
              <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Email</td>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.email}</td>
              </tr>
              <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Card holder</td>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.cardHolderName}</td>
              </tr>
              <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Card Type</td>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.creditCardType}</td>
              </tr>
              <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Payment Amount</td>
                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${data.paymentAmount?amountFormat(data.paymentAmount,2):''}</td>
              </tr>
          </table>

        </div>
            `,
      }
      resolve(mailOption)
    })
  },
}

