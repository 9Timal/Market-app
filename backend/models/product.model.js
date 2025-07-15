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
  },
  image_url: {
    type: String,
  },         // URL publique de l’image sur Cloudinary
  image_public_id:{
    type: String
  }     // ID unique Cloudinary (utile pour suppression)
});

module.exports = mongoose.model('Product', productSchema);
