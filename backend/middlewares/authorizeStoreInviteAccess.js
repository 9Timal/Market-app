// middlewares/authorizeStoreInviteAccess.js
const StoreAccess = require('../models/storeAccess.model');

const authorizeStoreInviteAccess = async (req, res, next) => {
  const { role, id: userId } = req.user;

  // ✅ Accès total pour les super_admin
  if (role === 'super_admin') return next();

  // 🔍 On récupère le store_id depuis le corps de la requête
  const storeId = req.body.store_id || req.params.store_id || req.query.store_id;

  if (!storeId) {
    return res.status(400).json({ message: "Le champ 'store_id' est requis." });
  }

  try {
    // ✅ Vérification : l'utilisateur doit être chef_admin du magasin
    const access = await StoreAccess.findOne({
      user: userId,
      store: storeId,
      role_in_store: 'chef_admin',
    });

    console.log("Middleware accès : user =", req.user, "storeId =", storeId);


    if (!access) {
      return res.status(403).json({
        message: "Accès refusé. Vous n'êtes pas autorisé à gérer les invitations pour ce magasin.",
      });
    }

    next();
  } catch (err) {
    console.error("Erreur middleware authorizeStoreInviteAccess :", err.message);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = authorizeStoreInviteAccess;
