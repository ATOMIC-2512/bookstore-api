const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

// Enrutador de la API
app.use('/api/v1', apiRoutes);

// Manejo de 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware Centralizado de Errores (debe llevar 4 parámetros: err, req, res, next)
app.use(errorHandler);

module.exports = app;