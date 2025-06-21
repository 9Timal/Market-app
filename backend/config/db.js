// On importe Mongoose pour gérer la connexion MongoDB
const mongoose = require('mongoose');

// On charge les variables d'environnement depuis .env
require('dotenv').config();

// On construit dynamiquement l’URL de connexion à MongoDB Atlas
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Atlas connecté");
  } catch (err) {
    console.error("❌ Erreur MongoDB :", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
