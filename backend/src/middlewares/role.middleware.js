const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.user) {
        return res.status(401).json({ 
          error: 'No autenticado' 
        });
      }

      // Verificar que el rol del usuario esté permitido
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          error: 'No tienes permisos para acceder a este recurso' 
        });
      }

      next();
    } catch (error) {
      console.error('Error en middleware de rol:', error);
      res.status(500).json({ 
        error: 'Error al verificar permisos' 
      });
    }
  };
};

module.exports = roleMiddleware;