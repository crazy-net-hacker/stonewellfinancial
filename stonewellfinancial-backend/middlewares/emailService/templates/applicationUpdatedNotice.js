module.exports = {
  // Notice that appliction contact info updated
  letterMailOptions(data) {
    return new Promise((resolve) => {

      const mailOption = {
        from: {name:'Stonewell Financial', 
              address: process.env.MAIL_USER},
        to: 'sales@stonewellfinancial.com',
        subject: `Application ${data.updateTarget} updated`,
        html: `
        <div>
          <p>Application (${data.application_id}) ${data.updateTarget} information has been updated.</p>
          <br>
          <p>Applicants Detail:</p>
          ${data.contactPersons.map(person => (
            `
            <p>${person.firstName} ${person.lastName} </p>
            `)).join('')
          }
        </div>
            `,
      }
      resolve(mailOption)
    })
  },
}

