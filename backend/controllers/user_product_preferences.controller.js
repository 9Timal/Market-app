const Preference = require('../models/userProductPreferences.model');

// Récupérer toutes les préférences de l'utilisateur connecté
const getUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const prefs = await Preference.find({ user_id: userId })
      .populate('product_id', 'name barcode category image_url');

    res.status(200).json(prefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajouter un produit aux préférences (ou le réactiver)
const addPreference = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    let pref = await Preference.findOne({ user_id: userId, product_id });

    if (pref) {
      pref.active = true;
      pref.blacklisted = false;
      await pref.save();
    } else {
      pref = await Preference.create({ user_id: userId, product_id });
    }

    res.status(200).json(pref);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Blacklister un produit
const blacklistProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    const pref = await Preference.findOneAndUpdate(
      { user_id: userId, product_id },
      { blacklisted: true, active: false },
      { new: true, upsert: true }
    );

    res.status(200).json(pref);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Retirer un produit des préférences (sans blacklist)
const removePreference = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    const pref = await Preference.findOneAndUpdate(
      { user_id: userId, product_id },
      { active: false },
      { new: true }
    );

    if (!pref) return res.status(404).json({ message: "Préférence non trouvée." });

    res.status(200).json({ message: "Produit retiré des préférences." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUserPreferences,
  addPreference,
  blacklistProduct,
  removePreference
};
