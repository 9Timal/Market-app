const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Fonction de login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Trouver l'utilisateur par son email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    // 2. Vérifier que le mot de passe correspond
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    // 3. Créer un token JWT
    const token = jwt.sign(
    { 
      id: user._id,
      email: user.email,    
      role: user.role
     },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
    );

    // 4. Répondre avec le token et les infos utiles
    res.status(200).json({
      message: "Connexion réussie.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Erreur lors du login :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// On exporte aussi login
module.exports = { login };
