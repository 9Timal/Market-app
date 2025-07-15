const Product = require('../models/product.model');
const cloudinary = require('../config/cloudinary');

const createProduct = async (req, res) => {
  try {
    const { name, price, category, barcode, marque } = req.body;

    const image_url = req.file.path;
    const image_public_id = req.file.filename;

    const product = await Product.create({
      name,
      price,
      category,
      barcode,
      marque,
      image_url,
      image_public_id
    });

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
    const productId = req.params.id;
    const { name, price, category, barcode, marque } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Produit non trouvé." });

    const updatedFields = { name, price, category, barcode, marque };

    // ✅ Une nouvelle image a été envoyée par le middleware multer/cloudinary
    if (req.file) {
      // 1. Supprimer l’ancienne image Cloudinary si elle existe
      if (product.image_public_id) {
        await cloudinary.uploader.destroy(product.image_public_id);
      }

      // 2. Récupérer les infos envoyées par multer (déjà uploadé automatiquement)
      updatedFields.image_url = req.file.path;
      updatedFields.image_public_id = req.file.filename; // <== check que c'est bien le bon champ
    }

    // 3. Mettre à jour le produit avec les nouvelles infos
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedFields, { new: true });

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Erreur mise à jour produit :", err);
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
  }const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé." });

    // ✅ Si une image existe, on la supprime de Cloudinary
    if (product.image_public_id) {
      try {
        await cloudinary.uploader.destroy(product.image_public_id);
        console.log("🗑 Image Cloudinary supprimée :", product.image_public_id);
      } catch (cloudErr) {
        console.warn("⚠️ Erreur suppression Cloudinary :", cloudErr.message);
      }
    }

    // ❌ Supprime le produit de la base de données
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Produit supprimé avec image." });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
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
