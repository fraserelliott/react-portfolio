const router = require('express').Router();
const userRoutes = require('./users.route');
const postRoutes = require('./posts.route');
const tagRoutes = require('./tags.route');
const imagesRoute = require('./images.route');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/tags', tagRoutes);
router.use('/images', imagesRoute);

module.exports = router;
