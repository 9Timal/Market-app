const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const {
  getAccessForUser,
  createAccess,
  updateAccess,
  deleteAccess,
  getAccessByStore
} = require('../controllers/store_access.controller');

// Routes protégées par token
router.get('/:userId', auth, getAccessForUser);
router.post('/', auth, createAccess);
router.put('/:id', auth, updateAccess);
router.delete('/:id', auth, deleteAccess);
//récupère toute les personnes ayant des accès dans un magasin
router.get('/store/:storeId', auth, getAccessByStore);

module.exports = router;
