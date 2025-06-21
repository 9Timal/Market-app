const Furniture = require('../models/furniture.model');

const createFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.create(req.body);
    res.status(201).json(furniture);
  } catch (err) {
    console.error('Erreur création mobilier :', err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const getAllFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.find().populate('store_id', 'name city');
    res.status(200).json(furniture);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const getFurnitureById = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);
    if (!furniture) return res.status(404).json({ message: "Objet non trouvé." });
    res.status(200).json(furniture);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const updateFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!furniture) return res.status(404).json({ message: "Objet non trouvé." });
    res.status(200).json(furniture);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const deleteFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findByIdAndDelete(req.params.id);
    if (!furniture) return res.status(404).json({ message: "Objet non trouvé." });
    res.status(200).json({ message: "Objet supprimé." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  createFurniture,
  getAllFurniture,
  getFurnitureById,
  updateFurniture,
  deleteFurniture
};
