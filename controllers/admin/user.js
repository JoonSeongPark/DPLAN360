const bcrypt = require("bcryptjs");

const User = require("../../models/user");
const Team = require("../../models/team");

exports.getUserSignup = (req, res, next) => {
  let successMessage = req.flash("success");
  if (successMessage.length > 0) successMessage = successMessage[0];
  else successMessage = null;

  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) errorMessage = errorMessage[0];
  else errorMessage = null;

  Team.findAll()
    .then((teams) => {
      res.render("auth/user-signup", {
        pageTitle: "Add User",
        menuTitle: "사용자 등록",
        path: "/admin/user-signup",
        teams: teams,
        successMessage,
        errorMessage,
        editing: false,
      });
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.postUserSignup = (req, res, next) => {
  const { teamId, name, email, leader } = req.body;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        req.flash("error", "사용자가 이미 존재합니다.");
        return res.redirect("/admin/user-signup");
      }
      bcrypt
        .hash(email, 12)
        .then((hashedPassword) => {
          Team.findByPk(teamId)
            .then((team) => {
              team
                .createUser({
                  name,
                  email,
                  password: hashedPassword,
                  leader,
                  block_auth: 0,
                })
                .then((user) => {
                  req.flash("success", "새로운 사용자가 생성되었습니다.");
                  return res.redirect("/admin/user-signup");
                })
                .catch((err) => {
                  return console.log(err);
                });
            })
            .catch((err) => {
              return console.log(err);
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

exports.getEditUser = (req, res, next) => {
  const { userId } = req.params;

  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) errorMessage = errorMessage[0];
  else errorMessage = null;

  Team.findAll()
    .then((teams) => {
      User.findByPk(userId)
        .then((user) => {
          res.render("auth/user-signup", {
            pageTitle: "Edit User",
            menuTitle: "사용자 수정",
            path: "users",
            user,
            teams,
            successMessage: null,
            errorMessage,
            editing: req.query.edit,
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
