const router = require("express").Router();

const userRoutes = require("./users.route");
const authRoutes = require("./auth.route");
const postRoutes = require("./posts.route");
const tagRoutes = require("./tags.route");
const uploadRoutes = require("./upload.route");
const imageRoutes = require("./images.route");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/tags", tagRoutes);
router.use("/upload", uploadRoutes);
router.use("/images", imageRoutes);

module.exports = router;