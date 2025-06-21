const express = require('express');
const router = express.Router();
const {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore
} = require('../controllers/stores.controller');

const auth = require('../middlewares/auth.middleware'); // protège les routes avec le token
const authorizeRole = require('../middlewares/authorizeRole');



// Récupérer tous les magasins
router.get('/', auth, getAllStores);

// Récupérer un magasin par ID
router.get('/:id', auth, getStoreById);

// Créer un nouveau magasin
router.post('/', auth, authorizeRole('super_admin'), createStore);

// Mettre à jour un magasin
router.put('/:id', auth, authorizeRole('super_admin'), updateStore);

// Supprimer un magasin
router.delete('/:id', auth, authorizeRole('super_admin'), deleteStore);


module.exports = router;
