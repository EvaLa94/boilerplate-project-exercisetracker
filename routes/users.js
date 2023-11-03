const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  const users = await User.find().select(["username"]);
  res.json(users);
});

router.post("/", (req, res) => {
  const user = new User({
    username: req.body.username,
  });
  user.save();

  res.json(user);
});

module.exports = router;
