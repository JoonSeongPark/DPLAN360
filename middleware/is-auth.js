// 로그인 안 되어있을 경우, 로그인 페이지로 이동
exports.isAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

// 팀장 계정이 아닐 경우, Home 화면으로 이동
exports.isLeader = (req, res, next) => {
  if (!req.session.user.leader) {
    return res.redirect("/");
  }
  next();
};

// 로그인 상태일 경우, 로그인 페이지 접근 불가
exports.isLogin = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
};

// 일반 팀이 아닐 경우, 캠페인 신규 등록 이용 불가
exports.isNotNormal = (req, res, next) => {
  if (!req.session.isNormal) {
    return res.redirect("/");
  }
  next();
};
