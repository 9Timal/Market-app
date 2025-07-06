const express = require('express');
const router = express.Router();

const {
  createInvitation,
  getAllInvitationsByStore,
  getInvitationByEmailOrStore,
  deleteInvitation,
  updateInvitationStatus,
  getMyInvitations,
  acceptInvitation,
  refuseInvitation
} = require('../controllers/storeInvite.controller');

const verifyToken = require('../middlewares/auth.middleware'); // vérifie le JWT
const authorizeStoreInviteAccess = require('../middlewares/authorizeStoreInviteAccess'); // vérifie rôle chef_admin ou super_admin
const authorizeRole = require('../middlewares/authorizeRole');

// 🔍 Recherche d’invitations (par email et/ou magasin)
router.get('/search', verifyToken,authorizeStoreInviteAccess, getInvitationByEmailOrStore);

// 👤 Récupérer toutes les invitations de l'utilisateur connecté
router.get('/me', verifyToken, getMyInvitations);

// 📦 Récupérer toutes les invitations d’un magasin
router.get('/store/:store_id', verifyToken,authorizeStoreInviteAccess, getAllInvitationsByStore);

// ➕ Créer une invitation (super_admin ou chef_admin du magasin)
router.post('/', verifyToken, authorizeStoreInviteAccess, createInvitation);

// 🔁 Modifier le statut d’une invitation (refusée / utilisée, etc.)
router.put('/:id/status', verifyToken,authorizeRole('super_admin'), updateInvitationStatus);

// ❌ Supprimer une invitation
router.delete('/:id', verifyToken,authorizeRole('super_admin'), deleteInvitation);

// ✅ Accepter une invitation (user connecté)
router.post('/:id/accept', verifyToken, acceptInvitation);

// ❌ Refuser une invitation (user connecté)
router.post('/:id/refuse', verifyToken, refuseInvitation);

module.exports = router;
