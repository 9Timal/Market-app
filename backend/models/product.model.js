const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image_url: {
    type: String
  },
  barcode: {
    type: String,
    unique: true,
    required: true
  },
  marque:{
    type: String,
    required:true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('Product', productSchema);
