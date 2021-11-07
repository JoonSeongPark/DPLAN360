const Agency = require("../../models/agency");
const Campaign = require("../../models/campaign");

exports.getAddAgency = (req, res, next) => {
  res.render("admin/edit-agency", {
    pageTitle: "Add Agency",
    menuTitle: "대행사 등록",
    path: "/admin/add-agency",
    editing: false,
  });
};

exports.postAddAgency = async (req, res, next) => {
  const {
    name,
    biz_name,
    pay_condition,
    deposit_type,
    bill_type,
    bill_publisher,
    memo,
  } = req.body;

  try {
    await Agency.create({
      name,
      biz_name,
      pay_condition,
      deposit_type,
      bill_type,
      bill_publisher,
      memo,
    });

    res.redirect("/agencies");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditAgency = async (req, res, next) => {
  const { agencyId } = req.params;

  try {
    const agency = await Agency.findByPk(agencyId);

    res.render("admin/edit-agency", {
      pageTitle: "Edit Agency",
      menuTitle: "대행사 수정",
      path: "/agencies",
      editing: req.query.edit,
      agency,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditAgency = async (req, res, next) => {
  const { agencyId } = req.body;
  const updated_name = req.body.name;
  const updated_biz_name = req.body.biz_name;
  const updated_pay_condition = req.body.pay_condition;
  const updated_deposit_type = req.body.deposit_type;
  const updated_bill_type = req.body.bill_type;
  const updated_bill_publisher = req.body.bill_publisher;
  const updated_memo = req.body.memo;

  try {
    const agency = await Agency.findByPk(agencyId);

    agency.name = updated_name;
    agency.biz_name = updated_biz_name;
    agency.pay_condition = updated_pay_condition;
    agency.deposit_type = updated_deposit_type;
    agency.bill_type = updated_bill_type;
    agency.bill_publisher = updated_bill_publisher;
    agency.memo = updated_memo;

    await agency.save();

    res.redirect("/agencies");
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteAgency = async (req, res, next) => {
  const { agencyId } = req.body;

  try {
    const firstCampaign = await Campaign.findOne({ where: { agencyId } });

    if (firstCampaign !== null) {
      res.redirect("/agencies");
      return;
    }
    
    const agency = await Agency.findByPk(agencyId);

    await agency.destroy();

    res.redirect("/agencies");
  } catch (err) {
    console.log(err);
  }
};
