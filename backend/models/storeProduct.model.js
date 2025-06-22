const mongoose = require('mongoose');

const storeProductSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  available_stock: {
    type: Number,
    required: true,
    default: 0
  },
  promo_label: {
    type: String // ex: "2+1 gratuit"
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StoreProduct', storeProductSchema);
