const router = require("express").Router();
const userRoutes = require("./users.route");
const imagesRoute = require("./images.route");
const authRoutes = require("./auth.route");

const portfolioRoutes = require("./portfolio");
const ideaspaceRoutes = require("./ideaspace");

router.use("/portfolio", portfolioRoutes);
router.use("/ideaspace", ideaspaceRoutes);

router.use("/users", userRoutes);
router.use("/images", imagesRoute);
router.use("/auth", authRoutes);

module.exports = router;
