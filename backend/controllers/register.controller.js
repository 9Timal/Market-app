const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  const { name, lastname, email, password, role } = req.body;

  try {
    // Vérification de l'existence de l'email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé." });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du nouvel utilisateur (rôle global forcé à 'user')
    const newUser = new User({
      name,
      lastname,
      email,
      password: hashedPassword,
      role:  role || 'user' // Toujours 'user' à l'inscription
    });

    // Sauvegarde en BDD
    await newUser.save();

    res.status(201).json({ message: "Utilisateur enregistré avec succès." });

  } catch (err) {
    console.error("Erreur lors de l'inscription :", err.message);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
};

module.exports = { register };
