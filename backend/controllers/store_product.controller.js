const StoreProduct = require('../models/storeProduct.model');
const Product = require('../models/product.model');

// Créer une association produit-magasin (storeProduct)
const createStoreProduct = async (req, res) => {
  try {
    const { store_id, product_id, price, available_stock, promo_label } = req.body;

    // Vérifier que le produit existe
    const existingProduct = await Product.findById(product_id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Produit global introuvable." });
    }

    // Vérifier que ce produit n'est pas déjà assigné à ce magasin
    const existingStoreProduct = await StoreProduct.findOne({ store_id, product_id });
    if (existingStoreProduct) {
      return res.status(400).json({ message: "Ce produit est déjà assigné à ce magasin." });
    }

    const storeProduct = await StoreProduct.create({
      store_id,
      product_id,
      price,
      available_stock,
      promo_label
    });

    res.status(201).json(storeProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer tous les produits assignés à un magasin donné
const getStoreProductsByStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const products = await StoreProduct.find({ store_id: storeId })
      .populate('product_id', 'name barcode category image_url');

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modifier le prix, le stock ou la promo
const updateStoreProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await StoreProduct.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: "Produit-magasin introuvable." });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer l'association d’un produit à un magasin
const deleteStoreProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await StoreProduct.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Produit-magasin non trouvé." });

    res.status(200).json({ message: "Produit retiré du magasin avec succès." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createStoreProduct,
  getStoreProductsByStore,
  updateStoreProduct,
  deleteStoreProduct
};
