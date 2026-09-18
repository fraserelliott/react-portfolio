const router = require("express").Router();
const postRoutes = require("./posts.route");
const tagRoutes = require("./tags.route");

router.use("/posts", postRoutes);
router.use("/tags", tagRoutes);

module.exports = router;
