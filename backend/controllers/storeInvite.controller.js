const StoreInvite = require('../models/storeInvite.model');
const StoreAccess = require('../models/storeAccess.model');

// ✅ Créer une invitation
const createInvitation = async (req, res) => {
  try {
    const { email, store_id, role } = req.body;

    const invite = new StoreInvite({
      email,
      store_id,
      role,
      created_by: req.user.id
    });

    await invite.save();

    return res.status(201).json(invite);
  } catch (error) {
    console.error('Erreur création invitation :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ✅ Lire toutes les invitations d’un magasin
const getAllInvitationsByStore = async (req, res) => {
    const { store_id} = req.params;
    try {   

        const invites = await StoreInvite.find({ store_id })
            .populate('created_by', 'name lastname') // 🧠 on choisit ce qu'on veut récupérer
            .sort({ created_at: -1 });
       
        // 💡 Formatage des données
        const formattedInvites = invites.map(invite => ({
        id: invite._id,
        email: invite.email,
        role: invite.role,
        status: invite.status,
        created_at: invite.created_at,
        expires_at: invite.expires_at,
        created_by: {
            id: invite.created_by._id,
            name: invite.created_by.name,
            lastname: invite.created_by.lastname,
        }
    }));

        res.status(200).json(formattedInvites);
    } catch (error) {
        console.error('Erreur récupération invitations :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// ✅ Rechercher une invitation par email et/ou magasin
const getInvitationByEmailOrStore = async (req, res) => {
  try {
    const { email, store_id } = req.query;
    const filter = {};

    if (email) filter.email = email.toLowerCase();
    if (store_id) filter.store_id = store_id;

    const invites = await StoreInvite.find(filter).sort({ created_at: -1 });

    res.status(200).json(invites);
  } catch (error) {
    console.error('Erreur recherche invitation :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ✅ Supprimer une invitation
const deleteInvitation = async (req, res) => {
  try {
    const { id } = req.params;

    if (role !== 'super_admin') {
      return res.status(403).json({ message: "Accès refusé. Seul un super_admin peut supprimer une invitation." });
    }

    const deleted = await StoreInvite.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Invitation non trouvée" });
    }

    res.status(200).json({ message: "Invitation supprimée avec succès" });
  } catch (error) {
    console.error('Erreur suppression invitation :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ✅ Modifier le statut d’une invitation
const updateInvitationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'accepted', 'refused'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const invite = await StoreInvite.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!invite) {
      return res.status(404).json({ message: "Invitation non trouvée" });
    }

    res.status(200).json(invite);
  } catch (error) {
    console.error('Erreur mise à jour invitation :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ✅ Récupérer les invitations pour l'utilisateur connecté (via son email)
const getMyInvitations = async (req, res) => {
  try {
        const email = req.user?.email;
    if (!email) {
        return res.status(401).json({ message: "Utilisateur non authentifié (email manquant)." });
    }

    const invites = await StoreInvite.find({email: email.toLowerCase()})
        .populate('store_id', 'name city address zip_code')
        .populate('created_by', 'name lastname') 
        .sort({ created_at: -1 });

         // 💡 Formatage des données
        const formattedInvites = invites.map(invite => ({
        id: invite._id,
        email: invite.email,
        store:{
            id:invite.store_id._id,
            name: invite.store_id.name,
            city: invite.store_id.city,
            address: invite.store_id.address,
            zip_code: invite.store_id.zip_code,
        },
        role: invite.role,
        status: invite.status,
        created_at: invite.created_at,
        expires_at: invite.expires_at,
        created_by: {
            id: invite.created_by._id,
            name: invite.created_by.name,
            lastname: invite.created_by.lastname,
        }
    }));
    
    
    res.status(200).json(formattedInvites);
  } catch (error) {
    console.error('Erreur récupération invitations utilisateur :', error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};




const acceptInvitation = async (req, res) => {
  try {
    const { id: userId, email } = req.user;
    const { id } = req.params;

    const invitation = await StoreInvite.findById(id);
    if (!invitation) {
      return res.status(404).json({ message: "Invitation introuvable." });
    }

    if (invitation.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ message: "Cette invitation ne vous est pas destinée." });
    }

    if (invitation.status !== 'pending' || new Date(invitation.expires_at) < new Date()) {
      return res.status(400).json({ message: "Invitation expirée ou déjà utilisée." });
    }

    // Vérifie si le user a déjà un accès à ce store
    const alreadyAccess = await StoreAccess.findOne({
      user: userId,
      store: invitation.store_id,
    });

    if (!alreadyAccess) {
      // Crée l'accès
      const access = new StoreAccess({
        user: userId,
        store: invitation.store_id,
        role_in_store: invitation.role
      });

      await access.save();
    }

    // Marque l’invitation comme utilisée
    invitation.status = 'used';
    await invitation.save();

    res.status(200).json({ message: "Invitation acceptée et accès accordé." });

  } catch (error) {
    console.error("Erreur acceptation invitation :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const refuseInvitation = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.params;

    const invitation = await StoreInvite.findById(id);
    if (!invitation) {
      return res.status(404).json({ message: "Invitation introuvable." });
    }

    if (invitation.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ message: "Cette invitation ne vous est pas destinée." });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ message: "Cette invitation a déjà été traitée." });
    }

    invitation.status = 'refused';
    await invitation.save();

    res.status(200).json({ message: "Invitation refusée." });

  } catch (error) {
    console.error("Erreur refus invitation :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};



module.exports = {
  createInvitation,
  getAllInvitationsByStore,
  getInvitationByEmailOrStore,
  deleteInvitation,
  updateInvitationStatus,
  getMyInvitations,
  acceptInvitation,
  refuseInvitation,
};
