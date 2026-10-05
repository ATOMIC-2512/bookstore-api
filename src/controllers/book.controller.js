const BookService = require('../services/book.service');

// El error.middleware usa res.statusCode, así que si el servicio lanzó un
// error con código HTTP (400, 404...) lo fijamos antes de delegar al middleware.
const handleError = (error, res, next) => {
  if (error.statusCode) res.status(error.statusCode);
  next(error);
};

exports.getBooks = async (req, res, next) => {
  try {
    const result = await BookService.getAllBooks(req.query);
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res, next);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const book = await BookService.getBookById(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    handleError(error, res, next);
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const book = await BookService.createBook(req.body);
    res.status(201).json({ message: 'Libro creado exitosamente', data: book });
  } catch (error) {
    handleError(error, res, next);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const book = await BookService.updateBook(req.params.id, req.body);
    res.status(200).json({ message: 'Libro actualizado exitosamente', data: book });
  } catch (error) {
    handleError(error, res, next);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    await BookService.deleteBook(req.params.id);
    res.status(200).json({ message: 'Libro eliminado exitosamente' });
  } catch (error) {
    handleError(error, res, next);
  }
};