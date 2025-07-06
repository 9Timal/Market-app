const express = require('express');
const router = express.Router();
const authorizeRole = require('../middlewares/authorizeRole');
const authMiddleware = require('../middlewares/auth.middleware');
const {
  deleteUser,
  updateUser,
  getUserById,
  getAllUsers,
  updatePassword,
  searchUsers
} = require('../controllers/user.controller');

// 🔐 Toutes les routes sont protégées par authMiddleware

router.get('/search', authMiddleware, searchUsers);
// Récupérer un utilisateur par ID (lui-même ou super_admin)
router.get('/:id', authMiddleware, getUserById);

// Mettre à jour les infos (nom/email) (lui-même ou super_admin)
router.put('/:id', authMiddleware, updateUser);

// Modifier le mot de passe (lui-même uniquement)
router.put('/:id/password', authMiddleware, updatePassword);

// GET all users → uniquement super_admin
router.get('/', authMiddleware, authorizeRole('super_admin'), getAllUsers);

// DELETE utilisateur → uniquement super_admin
router.delete('/:id', authMiddleware, authorizeRole('super_admin'), deleteUser);



module.exports = router;
