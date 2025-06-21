const StoreAccess = require('../models/storeAccess.model');

const authorizeProductAccess = async (req, res, next) => {
  const { role, id: userId } = req.user;

  if (role === 'super_admin') return next();

  // Le produit n'est pas lié à un store, donc on vérifie simplement s’il a un rôle local
  const access = await StoreAccess.findOne({
    user: userId,
    role_in_store: { $in: ['chef_admin', 'admin'] }
  });

  if (!access) {
    return res.status(403).json({ message: "Accès refusé. Vous n'êtes pas autorisé à gérer les produits." });
  }

  next();
};

module.exports = authorizeProductAccess;
