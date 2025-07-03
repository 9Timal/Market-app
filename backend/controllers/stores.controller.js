const Store = require('../models/store.model');


// Créer un magasin
const createStore = async (req, res) => {
  try {
    const { name, address, city, zip_code } = req.body;

    const newStore = new Store({
      name,
      address,
      city,
      zip_code,
    });

    await newStore.save();
    res.status(201).json({ message: 'Magasin créé avec succès', store: newStore });

  } catch (err) {
    console.error('Erreur création magasin :', err.message);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Récupérer tous les magasins
const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json(stores);
  } catch (err) {
    console.error('Erreur récupération magasins :', err.message);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Récupérer un magasin par ID
const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Magasin non trouvé.' });

    res.status(200).json(store);
  } catch (err) {
    console.error('Erreur récupération magasin :', err.message);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Mettre à jour un magasin
const updateStore = async (req, res) => {
  try {
    const { name, address, city, zip_code } = req.body;

    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      { name, address, city, zip_code },
      { new: true }
    );

    if (!updatedStore) return res.status(404).json({ message: 'Magasin non trouvé.' });

    res.status(200).json({ message: 'Magasin mis à jour', store: updatedStore });

  } catch (err) {
    console.error('Erreur mise à jour magasin :', err.message);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Supprimer un magasin
const deleteStore = async (req, res) => {
  try {
    const deletedStore = await Store.findByIdAndDelete(req.params.id);
    if (!deletedStore) return res.status(404).json({ message: 'Magasin non trouvé.' });

    res.status(200).json({ message: 'Magasin supprimé', store: deletedStore });
  } catch (err) {
    console.error('Erreur suppression magasin :', err.message);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Rechercher des magasins par nom, ville ou code postal (recherche partielle, insensible à la casse, limitée à 10 résultats)
const searchStores = async (req, res) => {
  try {
    const { name, city, zip_code } = req.query;

    // Vérifie qu'au moins un critère est fourni
    if (!name && !city && !zip_code) {
      return res.status(400).json({
        message: 'Veuillez fournir au moins un critère de recherche (name, city ou zip_code).'
      });
    }

    // Construction dynamique des filtres
    const filters = {
      ...(name && { name: { $regex: name, $options: 'i' } }),
      ...(city && { city: { $regex: city, $options: 'i' } }),
      ...(zip_code && { zip_code: { $regex: zip_code, $options: 'i' } })
    };

    // Recherche avec limite de 10 résultats
    const results = await Store.find(filters).limit(10);

    res.status(200).json(results);
  } catch (err) {
    console.error('Erreur recherche magasins :', err.message);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore,
  searchStores
};
