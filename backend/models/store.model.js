// models/store.model.js
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true 
    },           // Nom du magasin (ex: Auchan Tours Nord)
  address: { 
    type: String,
    required: true 
    },        // Adresse postale complète
  city: { 
    type: String,
    required: true 
    },           // Ville
  zip_code: { 
    type: String,
    required: true 
    },       // Code postal
  created_at: { 
    type: Date, 
    default: Date.now
    }   
});

module.exports = mongoose.model('Store', storeSchema);
