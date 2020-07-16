const bcrypt = require("bcryptjs");

const User = require("../../models/user");

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
          if (user.leader === 1) {
            req.session.isLeader = true;
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

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
};
