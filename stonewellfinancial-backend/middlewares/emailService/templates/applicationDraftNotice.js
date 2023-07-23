module.exports = {
  letterMailOptions(data) {
    return new Promise((resolve) => {
      const sendInfo = data;
      // console.log(data)
      const mailOption = {
        from: {
          name: 'Stonewell Financial',
          address: process.env.MAIL_USER
        },
        to: sendInfo.vendor_email !== 'info@stonewellfinancial.com' ? sendInfo.vendor_email : 'sales@stonewellfinancial.com',
        subject: `Reminder: Your Draft Application - ${data.application_id}`,
        html: `
        <div>
          <p>Hello ${data.vendor_name},</p>
          <br>
          <p>We would like to remind you that your application with ID ${data.application_id} is still in <span style="color:blue; font-weight:700;">Draft Status</span>. We kindly request that you review and submit your draft application. Your timely action is greatly appreciated.</p>
          <br>
          <p>Client Details:</p>
          ${data.insuredpersons.map(person => (
            `
            <p style="color:blue;">${person.firstName} ${person.lastName}</p>
            `
          )).join('')}
          <br>
          <p>Note:</p>
          ${data.remark ? `${data.remark.replace(/\r?\n/g, '<br />')}` : 'N/A'}
          <br>
          <br>
          <p>To view the details, please click here:</p>
          <p style="color:blue;">Application Search URL: <a href="https://www.stonewellfinancial.com/myportal/vendor/search-application?id=${data.application_id}">https://www.stonewellfinancial.com/myportal/vendor/search-application?id=${data.application_id}</a></p>
        </div>
        `,
      };

      resolve(mailOption);
    });
  },
};
