exports.getIndex = (req, res, next) => {
  res.render("work/index", {
    pageTitle: "Home",
    menuTitle: "Home",
    path: "/",
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};

exports.getSales = (req, res, next) => {
  const { team, agency, advertiser } = req.query;
  let { start_month, end_month } = req.query;
  const thisYear = new Date().getFullYear();
  const thisMonth =
    new Date().getMonth() < 10
      ? `0${new Date().getMonth()}`
      : new Date().getMonth();

  if (start_month === "") {
    start_month = `${thisYear}-01`;
  }
  if (end_month === "") {
    end_month = `${thisYear}-${thisMonth}`;
  }

  res.render("work/sales", {
    pageTitle: "Sales",
    menuTitle: "전체 매출조회",
    path: "/sales",
    sortInfo: {
      team,
      start_month,
      end_month,
      agency,
      advertiser,
    },
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};

exports.getMediaSales = (req, res, next) => {
  const { media } = req.query;
  let { start_month, end_month } = req.query;
  const thisYear = new Date().getFullYear();
  const thisMonth =
    new Date().getMonth() < 10
      ? `0${new Date().getMonth()}`
      : new Date().getMonth();

  if (start_month === "") {
    start_month = `${thisYear}-01`;
  }
  if (end_month === "") {
    end_month = `${thisYear}-${thisMonth}`;
  }

  res.render("work/media-sales", {
    pageTitle: "Media Sales",
    menuTitle: "매체별 매출조회",
    path: "/media-sales",
    sortInfo: {
      media,
      start_month,
      end_month,
    },
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};