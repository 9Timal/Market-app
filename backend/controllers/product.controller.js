const Product = require('../models/product.model');

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé." });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Produit non trouvé." });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé." });
    res.status(200).json({ message: "Produit supprimé." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchProducts = async (req, res) => {
  const { name, category, marque, barcode } = req.query;

  const filters = {};

  if (name) {
    filters.name = { $regex: `.*${name}.*`, $options: 'i' };
  }
  
  if (category) {
    filters.category = { $regex: `.*${category}.*`, $options: 'i' };
  }
  
  if (marque) {
    filters.marque = { $regex: `.*${marque}.*`, $options: 'i' };
  }
  
  if (barcode) {
    filters.barcode = { $regex: `.*${barcode}.*`, $options: 'i' };
  }

  try {
    const products = await Product.find(filters).limit(15).sort({ name: 1 });
    res.json(products);
  } catch (err) {
    console.error('❌ Erreur recherche produits :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts
};
