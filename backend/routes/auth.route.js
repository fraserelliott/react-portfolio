const router = require("express").Router();
const auth = require("../middleware/auth.middleware");

router.post("/verify", auth.validateToken, (req, res) => {
  res.json("Token verified");
});

module.exports = router;
