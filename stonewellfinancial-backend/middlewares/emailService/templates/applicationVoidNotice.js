module.exports = {
  letterMailOptions(data) {
    console.log(data)
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
        to: data.email,
        bcc: ['sales@stonewellfinancial.com', data.vendor_email],
        subject: `Your application has been voided`,
        html: `
        <div>
         
          <p><span>${data.remark.replace(/\r?\n/g, '<br />')}</span></p>

          <h3>Application details</h3>
            ${data.person.map(person => (
              `
                <h4>${person.lastName}, ${person.firstName}</h4>
                <table style="border-collapse: collapse; width:100%">
              
                  <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Insurance</td>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                      ${person.compnayName}  ${person.planName}
                      ${person.tripType === 'MULTI' ?
                      `&nbsp; ${person.multiTripDays} days option`:
                      ``}
                      ${person.optionPlan&&person.optionPlan.map((op, opIndex) => (
                        `
                        <br/><br/>${op.optionPlanName}
                        ${person.optionPlan.length > opIndex ? `<br/>`:``}
                        <span style="font-size:12px;color:#979797;">
                            &nbsp; &nbsp; &nbsp;  ${amountFormat(op.optionPlanCoverage,0)} coverage 
                        </span>
                        <br/>
                        `
                        )).join('') 
                      }
                    </td>
                  </tr>
                  <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Days of Coverage</td>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${person.tripStartDate} ~ ${person.tripEndDate} (${person.tripPeriod} days)</td>
                  </tr>
                  <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Your Total</td>
                    <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${amountFormat(person.totalAmount,2)}</td>
                  </tr>
                
                </table>
              `
            )).join('')}

          <p>if you have any questions, please don't hesitate to call us at 1-833-645-3858 or email us at info@stonewellfinancial.com.</p>
          <br/>
          <p style="font-weight:700">Stonewell Financial Services INC</p>
          <p>1-833-645-3858 | info@stonewellfianncial.com</p>

        </div>
            `,
      }
      resolve(mailOption)
    })
  },
}

