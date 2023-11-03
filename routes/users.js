const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Exercise = require("../models/Exercise");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Users
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

// Exercises
router.post("/:id/exercises", async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await User.findById(userID).select(["username"]);
    const { description, duration, date } = req.body;

    const exercise = new Exercise({
      description,
      duration,
      date: date ? new Date(date).toDateString() : new Date().toDateString(),
      userID,
    });

    exercise.save();

    res.json({
      _id: userID,
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: new Date(exercise.date).toDateString(),
    });
  } catch (err) {
    res.send(err.message);
  }
});

// Logs
router.get("/:id/logs", async (req, res) => {
  const userID = req.params.id;
  const { from, to, limit } = req.query;

  const user = await User.find({
    $and: [{ userID: userID }, { date: { $gt: from } }, { date: { $lt: to } }],
  }).select(["username"]);
  const exercises = await Exercise.find({ userID })
    .select(["description", "duration", "date"])
    .limit(limit);

  for (let el of exercises) {
    el.date = new Date(el.date).toDateString();
  }

  res.send({
    user,
    count: exercises.length,
    log: exercises,
  });
});

module.exports = router;
