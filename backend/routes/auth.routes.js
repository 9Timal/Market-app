const express = require('express');
const router = express.Router();

// On importe les fonctions qu'on a créées dans le contrôleur
const { register } = require('../controllers/register.controller');
const { login } = require('../controllers/login.controller');
const { 
    forgotPassword,
    resetPassword,
    checkToken
 } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Route POST /api/auth/
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/check', authMiddleware, checkToken);

// On exporte ce "mini-routeur" pour l'utiliser dans server.js
module.exports = router;
