const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const {
  getAccessForUser,
  createAccess,
  updateAccess,
  deleteAccess,
  getAccessForUserInStore,
  checkAccess,
  getAccessByStore
} = require('../controllers/store_access.controller');

// Routes protégées par token

router.get('/has-access/:storeId', auth, checkAccess);

router.get('/store/:storeId', auth, getAccessByStore);
router.get('/:userId', auth, getAccessForUser);
router.post('/', auth, createAccess);
router.put('/:id', auth, updateAccess);
router.delete('/:id', auth, deleteAccess);
//récupère toute les personnes ayant des accès dans un magasin
router.get('/access/:storeId/:userId', auth, getAccessForUserInStore);

module.exports = router;
