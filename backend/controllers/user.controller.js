const User = require('../models/user.model');
const StoreAccess = require('../models/storeAccess.model'); // Nécessaire
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const deleteUser = async (req, res) => {
  const userIdToDelete = req.params.id;
  const userRequestingId = req.user.id; // ID récupéré depuis le token
  const userRequestingRole = req.user.role;

  // Si l'utilisateur veut supprimer un autre compte sans être super_admin → interdit
  if (userRequestingId !== userIdToDelete && userRequestingRole !== 'super_admin') {
    return res.status(403).json({ message: "Seul un super_admin peut supprimer d'autres comptes." });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(userIdToDelete);

    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json({ message: "Utilisateur supprimé avec succès.", deletedUser });

  } catch (err) {
    console.error("Erreur lors de la suppression :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const updateUser = async (req, res) => {
  const userIdToUpdate = req.params.id;
  const { name, email } = req.body;

  const currentUserId = req.user.id;
  const currentUserRole = req.user.role;

  const isSelfUpdate = currentUserId === userIdToUpdate;

  // ✅ Cas 1 : mise à jour de soi-même
  if (isSelfUpdate) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userIdToUpdate,
        { name, email },
        { new: true }
      );
      return res.status(200).json({ message: "Profil mis à jour.", updatedUser });
    } catch (err) {
      console.error("Erreur update personnelle :", err.message);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  }

  // ✅ Cas 2 : modification du profil d’un autre → seulement super_admin
  if (currentUserRole !== 'super_admin') {
    return res.status(403).json({ message: "Accès refusé : seuls les super_admin peuvent modifier d'autres comptes." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userIdToUpdate,
      { name, email },
      { new: true }
    );
    return res.status(200).json({ message: "Utilisateur mis à jour par super_admin.", updatedUser });
  } catch (err) {
    console.error("Erreur super_admin :", err.message);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// GET /api/users/ → liste tous les utilisateurs (réservé au super_admin)
const getAllUsers = async (req, res) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: "Accès réservé aux super_admins." });
  }

  try {
    const users = await User.find({}, '-password'); // on cache les passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// GET /api/users/:id → détail d’un utilisateur (accès à soi ou super_admin)
const getUserById = async (req, res) => {
  const userId = req.params.id;
  const isSelf = req.user.id === userId;

  if (!isSelf && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: "Accès refusé." });
  }

  try {
    const user = await User.findById(userId, '-password');
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const updatePassword = async (req, res) => {
  const userId = req.params.id;
  const currentUserId = req.user.id;

  const { oldPassword, newPassword } = req.body;

  // ⚠️ Vérifie si c'est bien lui-même
  if (userId !== currentUserId) {
    return res.status(403).json({ message: "Vous ne pouvez changer que votre propre mot de passe." });
  }

  try {
    const user = await User.findById(userId);

    // 🔐 Vérifie que l'ancien mot de passe correspond
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Ancien mot de passe incorrect." });
    }

    // 🔐 Hash du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès." });

  } catch (err) {
    console.error("Erreur update password :", err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { 
  deleteUser,
  updateUser,
  getUserById,
  getAllUsers,
  updatePassword  
};
