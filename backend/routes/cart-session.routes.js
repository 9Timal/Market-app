const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');

const {
  getCart,
  addProductToCart,
  scanProduct,
  removeProductFromCart,
  completeCart
} = require('../controllers/cart_session.controller');

// Récupère le panier en cours pour un magasin donné
router.get('/:storeId', auth, getCart);

// Ajouter un produit au panier
router.post('/add', auth, addProductToCart);

// Marquer un produit comme scanné
router.post('/scan', auth, scanProduct);

// Retirer un produit
router.post('/remove', auth, removeProductFromCart);

// Finaliser le panier
router.post('/complete', auth, completeCart);

module.exports = router;
