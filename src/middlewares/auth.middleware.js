const jwt = require('jsonwebtoken');

// Verificar el token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado: Token no proporcionado' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

// Control de Acceso Basado en Roles (RBAC)
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Acceso prohibido: No tienes los permisos necesarios para realizar esta acción' 
      });
    }
    next();
  };
};

module.exports = { verifyToken, checkRole };
