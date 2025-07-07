const StoreAccess = require('../models/storeAccess.model');
const User = require('../models/user.model');

// 🔍 GET : Récupérer tous les accès d’un utilisateur
const getAccessForUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const accesses = await StoreAccess.find({ user: userId })
      .populate('store')  // ceci ajoute toutes les infos du magasin
      // .populate('user', 'name lastname email'); // facultatif si tu veux info user

    res.status(200).json(accesses);
  } catch (err) {
    console.error("Erreur récupération accès :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ➕ POST : Ajouter un accès pour un utilisateur à un magasin
const createAccess = async (req, res) => {
  try {
    const { user, store, role_in_store } = req.body;

    // Vérifie si l'accès existe déjà
    const existingAccess = await StoreAccess.findOne({ user, store});
    if (existingAccess) {
      return res.status(400).json({ message: "Accès déjà existant pour ce magasin." });
    }

    const newAccess = new StoreAccess({ user, store, role_in_store });
    await newAccess.save();
    console.log("✅ Ajout réussi :", newAccess);
    res.status(201).json({ message: "Accès ajouté.", access: newAccess });

  } catch (err) {
    console.error("Erreur ajout accès :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ✏️ PUT : Modifier un accès existant (changer le rôle local)
const updateAccess = async (req, res) => {
  try {
    const accessId = req.params.id;
    const { role_in_store } = req.body;

    const updated = await StoreAccess.findByIdAndUpdate(
      accessId,
      { role_in_store },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Accès non trouvé." });
    }

    res.status(200).json({ message: "Accès mis à jour.", access: updated });
  } catch (err) {
    console.error("Erreur modification accès :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ❌ DELETE : Supprimer un accès à un magasin
const deleteAccess = async (req, res) => {
  try {
    const accessId = req.params.id;
    const deleted = await StoreAccess.findByIdAndDelete(accessId);

    if (!deleted) {
      return res.status(404).json({ message: "Accès non trouvé." });
    }

    res.status(200).json({ message: "Accès supprimé.", access: deleted });
  } catch (err) {
    console.error("Erreur suppression accès :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// GET /api/access/store/:storeId → Liste des accès d’un magasin
const getAccessForUserInStore = async (req, res) => {
  const { storeId, userId } = req.params;

  try {
    // On récupère d'abord l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Puis on cherche l'accès à ce magasin
    const access = await StoreAccess.findOne({ user: userId, store: storeId });
    if (!access) {
      return res.status(404).json({ message: "Aucun accès trouvé pour cet utilisateur dans ce magasin." });
    }

    // Tout est bon, on répond avec les infos utiles
    res.status(200).json({
      message: "Accès trouvé.",
      user: {
        _id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role
      },
      access: access.role_in_store
    });

  } catch (err) {
    console.error("Erreur récupération accès par store :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const checkAccess = async (req, res) => {
  const storeId = req.params.storeId;
  const userId = req.user._id;
  const role = req.user.role;

  if (role === 'super_admin') {
    return res.status(200).json({ access: true });
  }

  const access = await StoreAccess.findOne({ user: userId, store: storeId });
  if (access) {
    return res.status(200).json({ access: true });
  }

  return res.status(403).json({ access: false });
};

const getAccessByStore = async (req, res) => {
  const { storeId } = req.params;

  try {
    const accesses = await StoreAccess.find({ store: storeId });

    const users = await Promise.all(accesses.map(async (access) => {
      const user = await User.findById(access.user).select('-password');
      return {
        _id: access._id,
        user: access.user,
        role: access.role_in_store,
        user, // contient name, lastname, email, etc.
      };
    }));

    res.status(200).json(users);
  } catch (err) {
    console.error('Erreur lors de la récupération des accès :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};



module.exports = {
  getAccessForUser,
  createAccess,
  updateAccess,
  deleteAccess,
  getAccessForUserInStore,
  checkAccess,
  getAccessByStore
};
