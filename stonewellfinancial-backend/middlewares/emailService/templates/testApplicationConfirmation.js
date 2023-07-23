module.exports = {
  letterMailOptions(data) {
    // amount Format 
    function amountFormat(amount, decimal)
    {
        return (
        parseFloat(amount).toLocaleString('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: decimal })
        )
    }
    return new Promise((resolve) => {
      let sendInfo = data
      var link = `http://localhost:3000/travel-insurance/direct-payment?confirmationNo=${sendInfo.confirmation_no}&contactName=${sendInfo.contact_name}&paymentAmount=${sendInfo.total_amount}`
      // var lank = 'https://www.stonewellfinancial.com'

      const mailOption = {
        from: {name:'Stonewell Financial', 
              address: process.env.MAIL_USER},
        to: sendInfo.email,
        // bcc: sendInfo.bcc?['sales@stonewellfinancial.com', sendInfo.bcc]:'sales@stonewellfinancial.com',
        subject: `Test - Your Travel Insurance application`,
        html: `
        <div>
          <p><strong>Hello, </strong></p>
          <br>
          <p> Payment method : Credit Card ${sendInfo.PaymentBy === 'Client' ?`(신청자 고객 직접 입력)`:``}</p>
          <p> Confirmation No. : ${sendInfo.confirmation_no} </>
          <p> Total payment : ${amountFormat(sendInfo.total_amount,2)} <p>
          ${sendInfo.PaymentBy === 'Client' 
            ? `<p> <a title="결제완료하기" href=${link}>결제완료하기</a></span></p>`
            : ``}
        </div>
            `,
      }
      resolve(mailOption)
    })
  },
}

