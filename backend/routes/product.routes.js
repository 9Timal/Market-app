const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const authorizeProductAccess = require('../middlewares/authorizeProductAccess');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts
} = require('../controllers/product.controller');

// GET /api/products/search
router.get('/search', auth, authorizeProductAccess, searchProducts);

// 🔒 Gestion réservée à super_admin, chef_admin, admin
router.get('/', auth, authorizeProductAccess, getAllProducts);
router.get('/:id', auth, authorizeProductAccess, getProductById);
router.post('/', auth, authorizeProductAccess, createProduct);
router.put('/:id', auth, authorizeProductAccess, updateProduct);
router.delete('/:id', auth, authorizeProductAccess, deleteProduct);



module.exports = router;
