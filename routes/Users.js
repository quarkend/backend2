const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      email: email,
      username: username,
      password: hash,
    });
    res.json("SUCCESS");
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ where: { email: email } });

  if (!user) res.json({ error: "User Doesn't Exist" });

  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong Username And Password Combination" });

    const accessToken = sign(
      { email: user.email, id: user.id },
      "importantsecret"
    );
    res.json({ token: accessToken, email: email, id: user.id });
  });
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});
// /***** */
router.get("/users", validateToken, async (req, res) => {
  const id = req.params.id;
  const setlistOfUsers = await Users.findAll({
    where: { id: id },
  });
  res.json(setlistOfUsers);
});

router.get("/users", async (req, res, next) => {
  console.log(req.params);

  Users.findAll(
    {
      attributes: {
        attr1: "id",
        attr2: "username",
      },
    },
    { order: [["username", "ASC"]] }
  )
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(500).json({ error }));
});

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  res.json(basicInfo);
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong Password Entered!" });

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );
      res.json("SUCCESS");
    });
  });
});

module.exports = router;

// const router = require("express").Router();
// module.exports = router
// router.get("/", (req, res) => {
//     res.send("hey its user route")

// })
