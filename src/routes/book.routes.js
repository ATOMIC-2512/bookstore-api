const { Router } = require('express');
const bookController = require('../controllers/book.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

const router = Router();

// Rutas Públicas / Clientes Autenticados
router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);

// Rutas Privadas / Exclusivas de Administradores
router.post('/', verifyToken, checkRole(['ADMIN']), bookController.createBook);
router.put('/:id', verifyToken, checkRole(['ADMIN']), bookController.updateBook);
router.delete('/:id', verifyToken, checkRole(['ADMIN']), bookController.deleteBook);

module.exports = router;
