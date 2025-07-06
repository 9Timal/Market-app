// middlewares/authorizeFurnitureAccess.js
const StoreAccess = require('../models/storeAccess.model');

const authorizeFurnitureAccess = async (req, res, next) => {
  const { role, id: userId } = req.user;

  // Si super_admin → accès total
  if (role === 'super_admin') return next();

  const storeId = req.body.store_id;

  if (!storeId) {
    return res.status(400).json({ message: "store_id manquant." });
  }

  try {
    const access = await StoreAccess.findOne({
      user: userId,
      store: storeId,
      role_in_store: 'chef_admin'
    });

    if (!access) {
      return res.status(403).json({ message: "Accès refusé. Vous n'êtes pas autorisé à modifier les objets 3D de ce magasin." });
    }

    next();

  } catch (err) {
    console.error("Erreur autorisation furniture :", err.message);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = authorizeFurnitureAccess;
