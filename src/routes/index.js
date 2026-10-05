const { Router } = require('express');
const authRoutes = require('./auth.routes');
const bookRoutes = require('./book.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);

module.exports = router;
