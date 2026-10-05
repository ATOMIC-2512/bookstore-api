const { Book, Category } = require('../models');
const { Op } = require('sequelize');

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Campos que el cliente puede enviar (evita que alguien modifique id, createdAt, etc.)
const ALLOWED_FIELDS = ['title', 'author', 'isbn', 'price', 'stock', 'categoryId'];

// Crea un Error con código HTTP asociado
const httpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const pickAllowedFields = (data = {}) =>
  ALLOWED_FIELDS.reduce((acc, field) => {
    if (data[field] !== undefined) acc[field] = data[field];
    return acc;
  }, {});

const assertValidId = (id) => {
  if (!UUID_REGEX.test(id)) throw httpError(400, 'El ID proporcionado no es válido.');
};

const assertCategoryExists = async (categoryId) => {
  if (categoryId === undefined || categoryId === null) return;
  if (!UUID_REGEX.test(categoryId)) throw httpError(400, 'El categoryId proporcionado no es válido.');
  const category = await Category.findByPk(categoryId);
  if (!category) throw httpError(400, 'La categoría indicada no existe.');
};

// Verifica que el ISBN no lo use otro libro. Se hace aquí (y no solo con la
// restricción UNIQUE) porque Sequelize interpreta el mensaje de error de
// PostgreSQL en inglés; con PostgreSQL en español el detalle del error llega vacío.
const assertIsbnAvailable = async (isbn, excludeId) => {
  if (!isbn) return;
  const where = { isbn };
  if (excludeId) where.id = { [Op.ne]: excludeId };
  const existing = await Book.findOne({ where });
  if (existing) throw httpError(400, 'Ya existe un libro registrado con ese ISBN.');
};

class BookService {
  static async getAllBooks(query) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { search, minPrice, maxPrice } = query;

    // Construcción dinámica de la cláusula WHERE
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } }, // iLike es insensible a mayúsculas en PostgreSQL
        { author: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
    }

    const { count, rows } = await Book.findAndCountAll({
      where: whereClause,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      books: rows,
    };
  }

  static async getBookById(id) {
    assertValidId(id);

    const book = await Book.findByPk(id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });
    if (!book) throw httpError(404, 'Libro no encontrado.');

    return book;
  }

  static async createBook(data) {
    const bookData = pickAllowedFields(data);
    await assertCategoryExists(bookData.categoryId);
    await assertIsbnAvailable(bookData.isbn);

    // Las validaciones (campos requeridos, ISBN único, precio/stock >= 0)
    // las lanza Sequelize y el error.middleware las convierte en 400.
    return await Book.create(bookData);
  }

  static async updateBook(id, data) {
    const book = await BookService.getBookById(id);

    const bookData = pickAllowedFields(data);
    await assertCategoryExists(bookData.categoryId);
    await assertIsbnAvailable(bookData.isbn, book.id);

    await book.update(bookData);
    return book;
  }

  static async deleteBook(id) {
    const book = await BookService.getBookById(id);
    await book.destroy();
  }
}

module.exports = BookService;