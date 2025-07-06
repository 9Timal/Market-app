const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  const { name, lastname, email, password, role } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();

    // Vérification de l'existence de l'email (en minuscule)
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      lastname,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || 'user'
    });

    await newUser.save();

    res.status(201).json({ message: "Utilisateur enregistré avec succès." });

  } catch (err) {
    console.error("Erreur lors de l'inscription :", err.message);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
};

module.exports = { register };
