exports.get404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    menuTitle: "페이지를 찾을 수 없습니다.",
    path: "/404",
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};
