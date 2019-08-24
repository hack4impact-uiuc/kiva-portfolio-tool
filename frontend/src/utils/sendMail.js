const nodemailer = require('nodemailer')
async function sendMail(mail_body) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.INFRA_EMAIL,
      clientId: process.env.INFRA_CLIENT_ID,
      clientSecret: process.env.INFRA_CLIENT_SECRET,
      refreshToken: process.env.INFRA_REFRESH_TOKEN
    }
  })
  await transporter.sendMail(mail_body)
}

export async function sendChangePasswordEmail(email, password, pm) {
  const mail_body = {
    from: 'hack4impact.infra@gmail.com',
    to: email,
    subject: 'Password Change Confirmation',
    text:
      'Hi, You have been added as a Field Partner by ' +
      pm +
      '. Your temporary password is ' +
      password +
      '.',
    html:
      '<p>Click <a href="https://vast-cove-61975.herokuapp.com/temporary">here</a> to login with your temporary password and reset your password</p>'
  }
  await sendMail(mail_body)
}
