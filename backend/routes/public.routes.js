// routes/public.routes.js
const express = require('express');
const router = express.Router();
const { 
    getFurnitureForStore,
    getPublicProducts,
    getPublicProductPositions

 } = require('../controllers/public.controller');

// Accessible sans restriction → lecture seule pour affichage 3D
router.get('/scene/:storeId', getFurnitureForStore);

// Lecture publique : produits disponibles (nom, image, code-barres)
router.get('/products', getPublicProducts);

// Lecture publique : produits positionnés dans un magasin donné
router.get('/product-positions/:storeId', getPublicProductPositions);

module.exports = router;
