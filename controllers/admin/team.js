const Team = require("../../models/team");
const User = require("../../models/user");
const Campaign = require("../../models/campaign");

exports.getAddTeam = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) errorMessage = errorMessage[0];
  else errorMessage = null;

  let successMessage = req.flash("success");
  if (successMessage.length > 0) successMessage = successMessage[0];
  else successMessage = null;

  res.render("admin/edit-team", {
    pageTitle: "Add Team",
    menuTitle: "팀 추가",
    path: "/admin/add-team",
    editing: false,
    successMessage,
    errorMessage,
  });
};

exports.postAddTeam = async (req, res, next) => {
  const name = req.body.name;
  const normal = req.body.normal;

  try {
    const team = await Team.findOne({
      where: {
        name,
      },
    });
    // 같은 팀명이 존재
    if (team) {
      req.flash("error", "같은 팀 이름이 존재합니다.");
      return res.redirect("/admin/add-team");
    }

    // 새로운 팀 생성
    await Team.create({ name, normal });

    req.flash("success", "팀이 성공적으로 생성되었습니다.");

    return res.redirect("/admin/add-team");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditTeam = async (req, res, next) => {
  const { teamId } = req.params;

  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) errorMessage = errorMessage[0];
  else errorMessage = null;

  try {
    const team = await Team.findByPk(teamId);

    res.render("admin/edit-team", {
      pageTitle: "Edit Team",
      menuTitle: "팀 수정",
      path: "edit-team",
      team,
      errorMessage,
      successMessage: null,
      editing: req.query.edit,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditTeam = async (req, res, next) => {
  const { teamId } = req.body;

  const updatedName = req.body.name;
  const updatedNormal = req.body.normal;

  try {
    const teamMatch = await Team.findOne({
      where: {
        name: updatedName,
      },
    });
    if (teamMatch) {
      req.flash("error", "팀 이름이 중복됩니다.");
      return res.redirect(`/admin/edit-team/${teamId}?edit=true`);
    }

    const team = await Team.findByPk(teamId);

    team.name = updatedName;
    team.normal = updatedNormal;

    await team.save();

    return res.redirect("/users");
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteTeam = async (req, res, next) => {
  const { teamId } = req.body;

  try {
    const team = await Team.findByPk(teamId, {
      include: [{ model: User }, { model: Campaign }],
    });

    if (team.users.length) {
      req.flash("error", "팀원이 존재하는 팀은 제거할 수 없습니다.");
      return res.redirect(`/admin/edit-team/${teamId}?edit=true`);
    }

    if (team.campaigns.length) {
      req.flash("error", "캠페인이 존재하는 팀은 제거할 수 없습니다.");
      return res.redirect(`/admin/edit-team/${teamId}?edit=true`);
    }

    await team.destroy();

    res.redirect("/users");
  } catch (err) {
    console.log(err);
  }
};
