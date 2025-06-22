const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');

const {
  getUserPreferences,
  addPreference,
  blacklistProduct,
  removePreference
} = require('../controllers/user_product_preferences.controller');

router.get('/', auth, getUserPreferences); // Toutes les préférences de l'utilisateur
router.post('/add', auth, addPreference); // Ajouter ou réactiver un produit
router.post('/blacklist', auth, blacklistProduct); // Blacklister un produit
router.post('/remove', auth, removePreference); // Retirer le produit de la préférence

module.exports = router;
