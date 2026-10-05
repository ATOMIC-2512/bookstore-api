const { sequelize, User, Book } = require('../models');

async function seed() {
  try {
    // Sincroniza la base de datos (recrea las tablas si no existen)
    await sequelize.sync({ force: true });
    console.log('✓ Tablas recreadas correctamente.');

    // 1. Crear Usuario Admin por defecto
    const adminUser = await User.create({
      name: 'Administrador Principal',
      email: 'admin@bookstore.com',
      password: 'AdminPassword123!',
      role: 'ADMIN',
    });

    // 2. Crear Usuario Cliente de prueba
    await User.create({
      name: 'Estudiante ISC',
      email: 'estudiante@isc.edu.mx',
      password: 'ClientePassword123!',
      role: 'CLIENT',
    });

    // 3. Crear Libros de prueba
    await Book.bulkCreate([
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        price: 45.99,
        stock: 10,
      },
      {
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Erich Gamma et al.',
        isbn: '978-0201633610',
        price: 54.50,
        stock: 5,
      },
    ]);

    console.log('✓ Datos de prueba (Seeders) cargados exitosamente.');
    console.log(`➜ Usuario Admin creado: ${adminUser.email} / AdminPassword123!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al ejecutar Seeder:', error);
    process.exit(1);
  }
}

seed();
