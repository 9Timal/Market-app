const StoreAccess = require('../models/storeAccess.model');

const authorizeStoreAccess = async (req, res, next) => {
  const { role, id: userId } = req.user;
  const storeId = req.body.store_id || req.params.storeId;

  if (role === 'super_admin') return next();

  if (!storeId) {
    return res.status(400).json({ message: "store_id manquant dans la requête." });
  }

  const access = await StoreAccess.findOne({
    user: userId,
    store: storeId,
    role_in_store: { $in: ['admin', 'chef_admin'] }
  });

  if (!access) {
    return res.status(403).json({ message: "Accès refusé. Vous n'avez pas les droits sur ce magasin." });
  }

  next();
};

module.exports = authorizeStoreAccess;
