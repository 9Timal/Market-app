const mongoose = require('mongoose');

const storeInviteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'chef_admin'],
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'refused'],
    default: 'pending',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  expires_at: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 60 * 1000), // expire dans 30 minutes
  }
},{
  collection: 'storeInvite' // ← Ici tu forces le nom exact de la collection
});

module.exports = mongoose.model('StoreInvite', storeInviteSchema);
