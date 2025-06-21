const StoreAccess = require('../models/storeAccess.model');

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
const getAccessByStore = async (req, res) => {
  const { storeId } = req.params;

  try {
    const accesses = await StoreAccess.find({ store_id: storeId })
      .populate('user_id', 'name email role') // pour inclure les infos de l’utilisateur
      .populate('store_id', 'name'); // optionnel, si tu veux afficher aussi le nom du magasin

    res.status(200).json(accesses);
  } catch (err) {
    console.error("Erreur récupération accès par store :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


module.exports = {
  getAccessForUser,
  createAccess,
  updateAccess,
  deleteAccess,
  getAccessByStore,
};
