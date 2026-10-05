const { Book } = require('../models');
const { Op } = require('sequelize');

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

  // ... (los demás métodos permanecen igual)
}

module.exports = BookService;


