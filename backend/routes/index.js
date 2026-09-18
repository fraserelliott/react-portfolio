const router = require("express").Router();
const userRoutes = require("./users.route");
const imagesRoute = require("./images.route");

const portfolioRoutes = require("./portfolio");

router.use("/portfolio", portfolioRoutes);

router.use("/users", userRoutes);
router.use("/images", imagesRoute);

module.exports = router;
