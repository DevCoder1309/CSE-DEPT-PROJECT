const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/register", (req, res) => {
  const name = "Register";
  res.render("user/register.ejs", { name });
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/admin");
    });
  } catch (e) {
    console.log(e);
    res.redirect("/register");
  }
});

router.get("/login", (req, res) => {
  const name = "Login";
  res.render("user/login.ejs", { name });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/admin");
  }
);

router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/admin");
  });
});

module.exports = router;
