const Team = require("../../models/team");

exports.getAddTeam = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) errorMessage = errorMessage[0];
  else errorMessage = null;

  let successMessage = req.flash("success");
  if (successMessage.length > 0) successMessage = successMessage[0];
  else successMessage = null;

  res.render("admin/add-team", {
    pageTitle: "Add Team",
    menuTitle: "팀 추가",
    path: "/admin/add-team",
    successMessage,
    errorMessage,
  });
};

exports.postAddTeam = async (req, res, next) => {
  const name = req.body.name;

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
    await Team.create({ name });

    req.flash("success", "팀이 성공적으로 생성되었습니다.");
    
    return res.redirect("/admin/add-team");
  } catch (err) {
    console.log(err);
  }
};
