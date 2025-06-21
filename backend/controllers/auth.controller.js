const crypto = require('crypto');
const User = require('../models/user.model');
const sendResetMail = require('../utils/sendMail');
const bcrypt = require('bcrypt');

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet e-mail." });

    const token = crypto.randomBytes(32).toString('hex');
    const resetLink = `http://localhost:4200/reset-password?token=${token}`; // ou lien de ton frontend

    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 1000 * 60 * 30; // 30 min
    await user.save();

    await sendResetMail(email, resetLink);
    res.status(200).json({ message: "Lien de réinitialisation envoyé par mail." });

  } catch (err) {
    console.error("Erreur forgot-password :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};



const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Token invalide ou expiré." });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });

  } catch (err) {
    console.error("Erreur reset-password :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  resetPassword,
  forgotPassword
};