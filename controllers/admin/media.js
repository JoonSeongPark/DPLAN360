const Medium = require("../../models/medium");

exports.getMedia = (req, res, next) => {
  Medium.findAll()
    .then((media) => {
      res.render("admin/media", {
        pageTitle: "Media",
        menuTitle: "매체 조회",
        path: "/admin/media",
        media: media.reverse(),
      });
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.getAddMedia = (req, res, next) => {
  res.render("admin/edit-media", {
    pageTitle: "Add Media",
    menuTitle: "매체 추가",
    path: "/admin/add-media",
    editing: false,
  });
};

exports.postAddMedia = (req, res, next) => {
  const name = req.body.name;
  const inter_type = req.body.inter_type;
  const inter_name = req.body.inter_name;
  const pay_condition = req.body.pay_condition;
  const bill_type = req.body.bill_type;
  const bill_publisher = req.body.bill_publisher;
  const provide_fee_rate = req.body.provide_fee_rate;
  const agency_fee_rate = req.body.agency_fee_rate;
  const media_fee_rate = req.body.media_fee_rate;
  const dplan_fee_rate = req.body.dplan_fee_rate;
  const inter_fee_rate = req.body.inter_fee_rate;
  const memo = req.body.memo;

  Medium.create({
    name: name,
    inter_type: inter_type,
    inter_name: inter_name,
    pay_condition: pay_condition,
    bill_type: bill_type,
    bill_publisher: bill_publisher,
    provide_fee_rate: provide_fee_rate,
    agency_fee_rate: agency_fee_rate,
    media_fee_rate: media_fee_rate,
    dplan_fee_rate: dplan_fee_rate,
    inter_fee_rate: inter_fee_rate,
    memo: memo,
  })
    .then(() => {
      console.log("Media Successfully Add!");
      res.redirect("/admin/media");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditMedia = (req, res, next) => {
  const mediumId = req.params.mediumId;

  Medium.findByPk(mediumId)
    .then((medium) => {
      res.render("admin/edit-media", {
        pageTitle: "Edit Media",
        menuTitle: "매체 수정",
        path: "/admin/media",
        editing: req.query.edit,
        medium: medium,
      });
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.postEditMedia = (req, res, next) => {
  const mediumId = req.body.mediumId;
  const updated_name = req.body.name;
  const updated_inter_type = req.body.inter_type;
  const updated_inter_name = req.body.inter_name;
  const updated_pay_condition = req.body.pay_condition;
  const updated_bill_type = req.body.bill_type;
  const updated_bill_publisher = req.body.bill_publisher;
  const updated_provide_fee_rate = req.body.provide_fee_rate;
  const updated_agency_fee_rate = req.body.agency_fee_rate;
  const updated_media_fee_rate = req.body.media_fee_rate;
  const updated_dplan_fee_rate = req.body.dplan_fee_rate;
  const updated_inter_fee_rate = req.body.inter_fee_rate;
  const updated_memo = req.body.memo;

  Medium.findByPk(mediumId)
    .then((medium) => {
      medium.name = updated_name;
      medium.inter_type = updated_inter_type;
      medium.inter_name = updated_inter_name;
      medium.pay_condition = updated_pay_condition;
      medium.bill_type = updated_bill_type;
      medium.bill_publisher = updated_bill_publisher;
      medium.provide_fee_rate = updated_provide_fee_rate;
      medium.agency_fee_rate = updated_agency_fee_rate;
      medium.media_fee_rate = updated_media_fee_rate;
      medium.dplan_fee_rate = updated_dplan_fee_rate;
      medium.inter_fee_rate = updated_inter_fee_rate;
      medium.memo = updated_memo;
      return medium.save();
    })
    .then((result) => {
      console.log("Media Updated!");
      res.redirect("/admin/media");
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.postDeleteMedia = (req, res, next) => {
  const mediumId = req.body.mediumId;

  Medium.findByPk(mediumId)
    .then((medium) => {
      return medium.destroy();
    })
    .then(() => {
      console.log("Media Destroyed!");
      res.redirect("/admin/media");
    })
    .catch((err) => {
      return console.log(err);
    });
};
