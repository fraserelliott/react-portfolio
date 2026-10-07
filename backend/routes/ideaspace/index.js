const router = require("express").Router();
const ideaRoutes = require("./ideas.route");
const ideatagRoutes = require("./ideatags.route");

router.use("/ideas", ideaRoutes);
router.use("/ideatags", ideatagRoutes);

module.exports = router;
