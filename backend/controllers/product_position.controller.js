const ProductPosition = require('../models/product_position.model');

const createProductPosition = async (req, res) => {
  try {
    const position = await ProductPosition.create(req.body);
    res.status(201).json(position);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllPositions = async (req, res) => {
  try {
    const positions = await ProductPosition.find()
      .populate('store_id', 'name')
      .populate('product_id', 'name barcode')
      .populate('furniture_id', 'instance_name');
    res.status(200).json(positions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPositionById = async (req, res) => {
  try {
    const position = await ProductPosition.findById(req.params.id)
      .populate('store_id')
      .populate('product_id')
      .populate('furniture_id');
    if (!position) return res.status(404).json({ message: "Position non trouvée." });
    res.status(200).json(position);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProductPosition = async (req, res) => {
  try {
    const position = await ProductPosition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!position) return res.status(404).json({ message: "Position non trouvée." });
    res.status(200).json(position);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProductPosition = async (req, res) => {
  try {
    const position = await ProductPosition.findByIdAndDelete(req.params.id);
    if (!position) return res.status(404).json({ message: "Position non trouvée." });
    res.status(200).json({ message: "Position supprimée." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProductPosition,
  getAllPositions,
  getPositionById,
  updateProductPosition,
  deleteProductPosition
};

