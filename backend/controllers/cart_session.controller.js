const CartSession = require('../models/cartSession.model');

// Récupérer le panier actif d’un utilisateur dans un magasin
const getCart = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    const cart = await CartSession.findOne({ user_id: userId, store_id: storeId, completed_at: null })
      .populate('products.product_id', 'name barcode category');

    if (!cart) return res.status(200).json({ products: [] }); // panier vide

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajouter un produit au panier
const addProductToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { store_id, product_id, price_snapshot } = req.body;

    let cart = await CartSession.findOne({ user_id: userId, store_id, completed_at: null });

    if (!cart) {
      cart = await CartSession.create({
        user_id: userId,
        store_id,
        products: [{ product_id, price_snapshot }]
      });
    } else {
      const exists = cart.products.find(p => p.product_id.toString() === product_id);
      if (exists) return res.status(400).json({ message: "Produit déjà dans le panier." });

      cart.products.push({ product_id, price_snapshot });
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Marquer un produit comme scanné
const scanProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;
    const cart = await CartSession.findOne({ user_id: userId, completed_at: null });

    if (!cart) return res.status(404).json({ message: "Panier introuvable." });

    const item = cart.products.find(p => p.product_id.toString() === product_id);
    if (!item) return res.status(404).json({ message: "Produit non trouvé dans le panier." });

    item.scanned = true;
    await cart.save();

    res.status(200).json({ message: "Produit scanné." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Retirer un produit
const removeProductFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    const cart = await CartSession.findOne({ user_id: userId, completed_at: null });
    if (!cart) return res.status(404).json({ message: "Panier introuvable." });

    cart.products = cart.products.filter(p => p.product_id.toString() !== product_id);
    await cart.save();

    res.status(200).json({ message: "Produit retiré." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Finaliser le panier
const completeCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await CartSession.findOne({ user_id: userId, completed_at: null });
    if (!cart) return res.status(404).json({ message: "Aucun panier en cours." });

    cart.completed_at = new Date();
    await cart.save();

    res.status(200).json({ message: "Panier terminé." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCart,
  addProductToCart,
  scanProduct,
  removeProductFromCart,
  completeCart
};
