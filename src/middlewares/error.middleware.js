const errorHandler = (err, req, res, next) => {
  console.error(`[Error Log]: ${err.stack}`);

  // Errores de Validación de Sequelize (Campos requeridos o duplicados)
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => e.message);
    return res.status(400).json({
      message: 'Error de validación en la base de datos',
      errors,
    });
  }

  // Error genérico o lanzado explícitamente con throw new Error()
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({
    message: err.message || 'Error interno del servidor',
  });
};

module.exports = errorHandler;