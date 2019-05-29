const nodemailer = require("nodemailer");
async function sendMail(mail_body) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "kivaportfolio@gmail.com",
      clientId: "308107387535-c76gh8di3bee4b3dqvha50p78fb9buar.apps.googleusercontent.com",
      clientSecret: "Xq6dJjiSkOwWurrrKAFIGEd4",
      refreshToken: "1/Ss7zJZNrD2mpVfe7J-1zfzG-Cjuu5Clt7dRRkKSSNO8"
    }
  });
  await transporter.sendMail(mail_body);
}

export async function sendChangePasswordEmail(email, password, pm) {
    console.log(email, password)
  const mail_body = {
    from: "hack4impact.infra@gmail.com",
    to: email,
    subject: "Password Change Confirmation",
    text:
      "Hi, You have been added as a Field Partner by " + pm + ". Your temporary password is " + password + ".",
    html: '<p>Click <a href="http://localhost:3000/temporary">here</a> to login with your temporary password and reset your password</p>'

  };
  await sendMail(mail_body);
}