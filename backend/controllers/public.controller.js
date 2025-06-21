// controllers/public.controller.js
const Furniture = require('../models/furniture.model');
const Product = require('../models/product.model');
const ProductPosition = require('../models/product_position.model');

// 🔍 Lecture publique des produits placés dans un magasin donné
const getPublicProductPositions = async (req, res) => {
  const { storeId } = req.params;

  try {
    const positions = await ProductPosition.find({ store_id: storeId })
      .populate('product_id', 'name barcode')
      .populate('furniture_id', 'instance_name');

    res.status(200).json(positions);

  } catch (err) {
    console.error("Erreur lecture publique product_positions :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


// Récupère tous les produits pour affichage (lecture front uniquement)
const getPublicProducts = async (req, res) => {
  try {
    const products = await Product.find().select('name image_url barcode category');
    res.status(200).json(products);
  } catch (err) {
    console.error("Erreur lecture publique produits :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const getFurnitureForStore = async (req, res) => {
  const { storeId } = req.params;

  try {
    const furniture = await Furniture.find({ store_id: storeId }).select(
      'type instance_name x y z rotation_y'
    );

    res.status(200).json(furniture);

  } catch (err) {
    console.error("Erreur récupération furniture scène :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  getFurnitureForStore,
  getPublicProducts,
  getPublicProductPositions
};