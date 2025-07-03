const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Vérifie si le token est présent dans l’en-tête
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès refusé. Token manquant." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Vérifie et décode le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Ajoute les infos de l’utilisateur dans req.user
    req.user = decoded; // contient { id, role }

    next(); // passe au contrôleur suivant
  } catch (err) {
    return res.status(403).json({ message: "Token invalide ou expiré." });
  }
};

module.exports = authMiddleware ;
