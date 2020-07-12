exports.getTaxBill = (req, res, next) => {
  res.render("work/tax-bill", {
    pageTitle: "Tax Bill",
    menuTitle: "세금 계산서",
    path: "/tax-bill",
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};
