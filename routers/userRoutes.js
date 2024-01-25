const express = require("express");
const router = express.Router();

const userModel = require("../models/users");

router.post("/signup", async (req, res) => {
  const { username, email, password, profilePicture } = req.body;
  try {
    const user = await userModel.create({
      username,
      email,
      password,
      profilePicture,
    });
    return res.send({ user, message: "user created" });
  } catch (err) {
    return res.send({ message: "user already exists" });
  }
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.send({ message: "username and password are required!" });
  }
  const user = await userModel.findOne({ username: username });
  if (!user) {
    return res.send({ message: "username or password is incorrect!" });
  }
  const isMatch = password == user.password;
  if (!isMatch) {
    return res.send({ message: "username or password is incorrect!" });
  }
  console.log("user logged in ");
  res.send({ user: user });
});

router.get("/", async (req, res) => {
  const { username } = req.query;
  if (!username) {
    const user = await userModel.find({});
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ msg: "user not found" });
    }
  } else {
    const user = await userModel.findOne({ username: username });
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ msg: "user not found" });
    }
  }
});

//update user

router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const { username, email, password, profilePicture } = req.body;
  if (!userId) {
    res.status(400).json({ message: "Missing required fields" });
  } else {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        password,
        profilePicture,
      },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).send(updatedUser);
    } else {
      res.status(500).json({ message: "Error" });
    }
  }
});

module.exports = router;
