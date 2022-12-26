const router = require("express").Router();
router.get("/user", async (req, res) => {
  res.send("User");
});

module.exports = router;
