const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const authorizeProductAccess = require('../middlewares/authorizeProductAccess');
const {
  createProductPosition,
  getAllPositions,
  getPositionById,
  updateProductPosition,
  deleteProductPosition
} = require('../controllers/product_position.controller');


// Gestion réservée à super_admin, chef_admin, admin
router.get('/', auth, authorizeProductAccess, getAllPositions);
router.get('/:id', auth, authorizeProductAccess, getPositionById);
router.post('/', auth, authorizeProductAccess, createProductPosition);
router.put('/:id', auth, authorizeProductAccess, updateProductPosition);
router.delete('/:id', auth, authorizeProductAccess, deleteProductPosition);

module.exports = router;
