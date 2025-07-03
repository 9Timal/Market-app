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
  const { name, lastname, email, role } = req.body;

  const currentUserId = req.user.id;
  const currentUserRole = req.user.role;

  const isSelfUpdate = currentUserId === userIdToUpdate;

  // ✅ Cas 1 : mise à jour de soi-même
  if (isSelfUpdate) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userIdToUpdate,
        { name, lastname, email },
        { new: true }
      );
      return res.status(200).json({ message: "Profil mis à jour.", updatedUser });
    } catch (err) {
      console.error("Erreur update personnelle :", err.message);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  }

  // ✅ Cas 2 : mise à jour par un super_admin
  if (currentUserRole === "super_admin") {
    try {
      const updateFields = { name, lastname, email };
      if (role) updateFields.role = role; // autoriser changement de rôle

      const updatedUser = await User.findByIdAndUpdate(
        userIdToUpdate,
        updateFields,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      return res.status(200).json({ message: "Utilisateur mis à jour par un super_admin.", updatedUser });
    } catch (err) {
      console.error("Erreur update par super_admin :", err.message);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  }

  // ❌ Cas interdit
  return res.status(403).json({ message: "Action non autorisée." });
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

// GET /api/users/search?firstName=...&lastName=...&email=...

 const searchUsers = async (req, res) => {
  const { name, lastname, email } = req.query;

  const filters = {};

  if (name) {
    filters.name = { $regex: new RegExp(name, 'i') };
  }

  if (lastname) {
    filters.lastname = { $regex: new RegExp(lastname, 'i') };
  }

  if (email) {
    filters.email = { $regex: new RegExp(email, 'i') };
  }

  try {
    const users = await User.find(filters).limit(15).sort({ lastname: 1 });
    res.json(users);
  } catch (err) {
    console.error('❌ Erreur recherche utilisateurs :', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { 
  deleteUser,
  updateUser,
  getUserById,
  getAllUsers,
  updatePassword,
  searchUsers
};
