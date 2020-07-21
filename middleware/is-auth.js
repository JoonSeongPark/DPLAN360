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

// 관리자 계정일 경우, 관리자 탭 메뉴만 이용 가능
exports.isAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    return res.redirect("/");
  }
  next();
};
