const nodemailer = require('nodemailer')

const credentials = {
  host: process.env.MAIL_HOST,
  // secure: true,
  secureConnection: false,
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
}

const transporter = nodemailer.createTransport(credentials)

module.exports = {
  sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) return reject(err)
        resolve(info)
      })
    })
  },
}