const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (req, res) => {
  const recipient = req.body.email;

  let transporter = nodemailer.createTransport({
    service: process.env.APP_MAILING_CONFIG_SERVICE,
    auth: {
      user: process.env.APP_MAILING_CONFIG_EMAIL,
      pass: process.env.APP_MAILING_CONFIG_PASSWORD,
    },
  });

  let mailOptions = {
    from: `${process.env.APP_PROJECT_NAME} <process.env.APP_MAILING_CONFIG_EMAIL>`,
    to: `${recipient}`,
    subject: "Confirmation d'inscription",
    html: "<p>Bonjour, </p><p>Nous vous confirmons votre inscription sur notre plateforme E-Garden.</p><p>Vous avez désormais accès à l'ensemble de notre site. En cas de problème, n'hésitez pas à nous contacter sur le forum.</p><p>À très vite.</p><p>Cordialement.</p><p>L'équipe E-Garden</p>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(`An error occured while sending the email !`, error);
    } else {
      console.log(
        `Confirmation mail has been sent successfully to user : ${recipient} !`
      );

      return res.status(200).json({
        response: `Confirmation mail has been sent successfully to user : ${recipient} !`,
      });
    }
  });
};

module.exports = { sendMail };
