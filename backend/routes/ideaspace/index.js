const router = require("express").Router();
const ideaRoutes = require("./ideas.route");

router.use("/ideas", ideaRoutes);

module.exports = router;
