// On importe Express pour créer notre application backend
const express = require('express');

// On importe CORS pour autoriser les requêtes provenant d'autres origines (ex: frontend Angular)
const cors = require('cors');

// On importe notre fonction de connexion à MongoDB (elle vient du fichier db.js)
const connectDB = require('./config/db');

// On appelle connectDB() pour établir la connexion à MongoDB dès le démarrage
connectDB();

// On initialise l'application Express
const app = express();

// Middleware pour accepter les requêtes en JSON
app.use(express.json());

// Middleware pour gérer les CORS (utile pour les appels depuis le frontend)
app.use(cors());

// Ici, les routes (auth, produits, etc.)
// app.use('/api/auth', require('./routes/auth.routes'));
// routes d'authentification
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/users.routes');
app.use('/api/users', userRoutes);

const storeRoutes = require('./routes/stores.routes');
app.use('/api/stores', storeRoutes);

const storeAccessRoutes = require('./routes/store_access.routes');
app.use('/api/store_access', storeAccessRoutes);

const furnitureRoutes = require('./routes/furniture.routes');
app.use('/api/furniture', furnitureRoutes);

const publicRoutes = require('./routes/public.routes');
app.use('/api/public', publicRoutes);

const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

const storeProductRoutes = require('./routes/store-products.routes');
app.use('/api/store-products', storeProductRoutes);

const cartSessionRoutes = require('./routes/cart-session.routes');
app.use('/api/cart-session', cartSessionRoutes);

const userPreferencesRoutes = require('./routes/user-product-preferences.routes');
app.use('/api/preferences', userPreferencesRoutes);


// Port sur lequel notre serveur va écouter
const PORT = process.env.PORT || 3000;

// On lance le serveur : il attend les requêtes sur http://localhost:3000
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
