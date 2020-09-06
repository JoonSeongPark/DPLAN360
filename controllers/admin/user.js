const bcrypt = require("bcryptjs");

const User = require("../../models/user");
const Team = require("../../models/team");

exports.getUserSignup = async (req, res, next) => {
  let successMessage = req.flash("success");
  if (successMessage.length > 0) successMessage = successMessage[0];
  else successMessage = null;

  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) errorMessage = errorMessage[0];
  else errorMessage = null;

  try {
    const teams = await Team.findAll();

    res.render("auth/user-signup", {
      pageTitle: "Add User",
      menuTitle: "사용자 등록",
      path: "/admin/user-signup",
      teams: teams,
      successMessage,
      errorMessage,
      editing: false,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postUserSignup = async (req, res, next) => {
  const { teamId, name, email, leader } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });

    if (user) {
      req.flash("error", "사용자가 이미 존재합니다.");
      return res.redirect("/admin/user-signup");
    }
    const hashedPassword = await bcrypt.hash(email, 12);

    const team = await Team.findByPk(teamId);

    await team.createUser({
      name,
      email,
      password: hashedPassword,
      leader,
      block_auth: 0,
    });

    req.flash("success", "새로운 사용자가 생성되었습니다.");

    return res.redirect("/admin/user-signup");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditUser = async (req, res, next) => {
  const { userId } = req.params;

  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) errorMessage = errorMessage[0];
  else errorMessage = null;

  try {
    const teams = await Team.findAll();

    const user = await User.findByPk(userId);

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
  } catch (err) {
    console.log(err);
  }
};

exports.postEditUser = async (req, res, next) => {
  const { userId } = req.body;

  const updatedName = req.body.name;
  const updatedEmail = req.body.email;
  const updatedTeamId = req.body.teamId;
  const updatedLeader = req.body.leader;
  const updatedBlockAuth = req.body.blockAuth;

  try {
    const userMatch = await User.findOne({ where: { email: updatedEmail } });

    if (userMatch) {
      req.flash("error", "이메일이 이미 존재합니다.");
      return res.redirect(`/admin/edit-user/${userId}?edit=true`);
    }

    const user = await User.findByPk(userId);

    user.name = updatedName;
    user.email = updatedEmail;
    user.teamId = updatedTeamId;
    user.leader = updatedLeader;
    user.block_auth = updatedBlockAuth;

    await user.save();

    res.redirect("/users");
  } catch (err) {
    console.log(err);
  }
};
