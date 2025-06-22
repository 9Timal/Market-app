const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const authorizeStoreAccess = require('../middlewares/authorizeStoreAccess');

const {
  createStoreProduct,
  getStoreProductsByStore,
  updateStoreProduct,
  deleteStoreProduct
} = require('../controllers/store_product.controller');

// 👥 Tous les accès : super_admin, chef_admin, admin (par magasin)
router.post('/', auth, authorizeStoreAccess, createStoreProduct);
router.get('/:storeId', auth, authorizeStoreAccess, getStoreProductsByStore);
router.put('/:id', auth, authorizeStoreAccess, updateStoreProduct);
router.delete('/:id', auth, authorizeStoreAccess, deleteStoreProduct);

module.exports = router;
