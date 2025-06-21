const mongoose = require('mongoose');

const furnitureSchema = new mongoose.Schema({
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  instance_name: {
    type: String,
    required: true
  },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  z: { type: Number, required: true },
  rotation_y: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Furniture', furnitureSchema);
