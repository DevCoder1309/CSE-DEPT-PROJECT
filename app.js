const express = require("express");
const app = express();
const route = require("./routes/routes");
const userRoute = require("./routes/userRoutes");
const path = require("path");
const ejsMate = require("ejs-mate");
const User = require("./models/user");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

mongoose
  .connect("mongodb://127.0.0.1:27017/CSE")
  .then(() => console.log("MONGODB CONNECTED"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const secretConfig = {
  secret: "thishouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(secretConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", route);
app.use("/users", userRoute);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
