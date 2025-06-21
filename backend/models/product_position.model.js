const mongoose = require('mongoose');

const productPositionSchema = new mongoose.Schema({
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  furniture_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Furniture',
    required: true
  },
  shelf_index: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProductPosition', productPositionSchema);
