const Agency = require("../../models/agency");

exports.getAgencies = (req, res, next) => {
  Agency.findAll()
    .then((agencies) => {
      res.render("admin/agencies", {
        pageTitle: "Agencies",
        menuTitle: "대행사 조회",
        path: "/admin/agencies",
        agencies: agencies,
      });
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.getAddAgency = (req, res, next) => {
  res.render("admin/edit-agency", {
    pageTitle: "Add Agency",
    menuTitle: "대행사 추가",
    path: "/admin/add-agency",
    editing: false,
  });
};

exports.postAddAgency = (req, res, next) => {
  const name = req.body.name;
  const pay_condition = req.body.pay_condition;
  const doposit_type = req.body.doposit_type;
  const bill_type = req.body.bill_type;
  const bill_publisher = req.body.bill_publisher;
  const memo = req.body.memo;

  Agency.create({
    name: name,
    pay_condition: pay_condition,
    doposit_type: doposit_type,
    bill_type: bill_type,
    bill_publisher: bill_publisher,
    memo: memo,
  })
    .then((agency) => {
      console.log("Agency Successfully Add!");
      res.redirect("/admin/agencies");
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.getEditAgency = (req, res, next) => {
  const agencyId = req.params.agencyId;

  Agency.findByPk(agencyId)
    .then((agency) => {
      res.render("admin/edit-agency", {
        pageTitle: "Edit Agency",
        menuTitle: "대행사 수정",
        path: "/admin/agencies",
        editing: req.query.edit,
        agency: agency,
      });
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.postEditAgency = (req, res, next) => {
  const agencyId = req.body.agencyId;
  const updated_name = name;
  const updated_pay_condition = pay_condition;
  const updated_doposit_type = doposit_type;
  const updated_bill_type = bill_type;
  const updated_bill_publisher = bill_publisher;
  const updated_memo = memo;

  Agency.findByPk(agencyId)
    .then((agency) => {
      agency.name = updated_name;
      agency.pay_condition = updated_pay_condition;
      agency.doposit_type = updated_doposit_type;
      agency.bill_type = updated_bill_type;
      agency.bill_publisher = updated_bill_publisher;
      agency.memo = updated_memo;
      return agency.save();
    })
    .then((result) => {
      console.log("Agency Updated!");
      res.redirect("/admin/agencies");
    })
    .catch((err) => {
      return console.log(err);
    });
};

exports.postDeleteAgency = (req, res, next) => {
  const agencyId = req.body.agencyId;

  Agency.findByPk(agencyId)
    .then((agency) => {
      console.log("Delete Agency!");
      return agency.destroy();
    })
    .then(() => {
      res.redirect("/admin/agencies");
    })
    .catch((err) => {
      return console.log(err);
    });
};
