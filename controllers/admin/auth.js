const bcrypt = require("bcryptjs");

const User = require("../../models/user");
const Team = require("../../models/team");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) message = message[0];
  else message = null;

  res.render("auth/login", {
    pageTitle: "Login",
    menuTitle: "로그인",
    path: "/login",
    errorMessage: message,
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        req.flash("error", "사용자가 존재하지 않습니다.");
        return res.redirect("/login");
      }

      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          if (user.email === "admin@d-plan360.com") {
            req.session.isAdmin = true;
          }
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        req.flash("error", "비밀번호가 일치하지 않습니다.");
        res.redirect("/login");
      });
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.getUserSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) message = message[0];
  else message = null;
  Team.findAll()
    .then((teams) => {
      res.render("auth/user-signup", {
        pageTitle: "Add User",
        menuTitle: "사용자 등록",
        path: "/admin/user-signup",
        teams: teams,
        errorMessage: message,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
      });
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.postUserSignup = (req, res, next) => {
  const teamId = req.body.team;

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmed_password = req.body.confirmed_password;

  console.log(email);
  User.findOne({ where: { email: email } })
    .then((user) => {
      console.log(user);
      if (user) {
        req.flash("error", "사용자가 이미 존재합니다.");
        return res.redirect("/admin/user-signup");
      }
      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          Team.findByPk(teamId).then((team) => {
            team
              .createUser({
                name: name,
                email: email,
                password: hashedPassword,
              })
              .then((result) => {
                res.redirect("/login");
              })
              .catch((err) => {
                return console.log(err);
              });
          });
        })
        .catch((err) => {
          return console.log(err);
        });
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
};
