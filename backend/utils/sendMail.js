const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,   // Ton adresse Gmail
    pass: process.env.MAIL_PASS    // Mot de passe ou App Password
  }
});

const sendResetMail = (to, link) => {
  const html = `
    <div style="font-family:sans-serif;padding:20px">
      <h2>Réinitialisation de votre mot de passe</h2>
      <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
      <a href="${link}">${link}</a>
      <p>Ce lien expirera dans 30 minutes.</p>
    </div>
  `;

  return transporter.sendMail({
    from: `"Market App" <${process.env.MAIL_USER}>`,
    to,
    subject: "Réinitialisation de mot de passe",
    html
  });
};

module.exports = sendResetMail;
