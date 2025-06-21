const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const authorizeFurnitureAccess = require('../middlewares/authorizeFurnitureAccess');

const {
  createFurniture,
  getAllFurniture,
  getFurnitureById,
  updateFurniture,
  deleteFurniture
} = require('../controllers/furniture.controller');

// 🔒 Lecture et gestion réservées aux super_admin et chef_admin (back office)
router.get('/', auth, authorizeFurnitureAccess, getAllFurniture);
router.get('/:id', auth, authorizeFurnitureAccess, getFurnitureById);
router.post('/', auth, authorizeFurnitureAccess, createFurniture);
router.put('/:id', auth, authorizeFurnitureAccess, updateFurniture);
router.delete('/:id', auth, authorizeFurnitureAccess, deleteFurniture);

module.exports = router;
