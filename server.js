const app = require('./src/app');
const { sequelize } = require('./src/models');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Sincronizar DB (en producción se prefieren migraciones)
    await sequelize.sync({ force: false });
    console.log('✓ Base de datos PostgreSQL conectada y sincronizada.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  }
}

startServer();
