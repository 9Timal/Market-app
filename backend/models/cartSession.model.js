const mongoose = require('mongoose');

const cartSessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  products: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      scanned: {
        type: Boolean,
        default: false
      },
      price_snapshot: {
        type: Number,
        required: true
      },
      added_at: {
        type: Date,
        default: Date.now
      }
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  },
  completed_at: {
    type: Date
  }
});

module.exports = mongoose.model('CartSession', cartSessionSchema);
