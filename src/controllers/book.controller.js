exports.getBooks = async (req, res, next) => {
  try {
    const result = await BookService.getAllBooks(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};