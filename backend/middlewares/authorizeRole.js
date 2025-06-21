// Vérifie que l'utilisateur a l'un des rôles autorisés
module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Accès refusé...`
      });
    }

    next();
  };
};
