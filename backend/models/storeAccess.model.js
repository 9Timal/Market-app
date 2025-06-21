// models/storeAccess.model.js
const mongoose = require('mongoose');

const storeAccessSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
    },
  store: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true 
    },
  role_in_store: {
    type: String,
    enum: ['admin', 'chef_admin'],
    required: true
  },
  created_at: { 
    type: Date, 
    default: Date.now
    }
},{
  collection: 'storeAccess' // ← Ici tu forces le nom exact de la collection
});

module.exports = mongoose.model('StoreAccess', storeAccessSchema);
