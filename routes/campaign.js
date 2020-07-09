const express = require("express");

const router = express.Router();

const campaignController = require("../controllers/campaign");
const authMiddleware = require("../middleware/is-auth");

router.get(
  "/campaign/:campaignId",
  authMiddleware.isAuth,
  campaignController.getCampaign
);

router.get(
  "/add-campaign",
  authMiddleware.isAuth,
  campaignController.getAddCampaign
);
router.post(
  "/add-campaign",
  authMiddleware.isAuth,
  campaignController.postAddCampaign
);

router.get(
  "/edit-campaign/:campaignId",
  authMiddleware.isAuth,
  campaignController.getEditCampaign
);

router.post(
  "/edit-campaign/",
  authMiddleware.isAuth,
  campaignController.postEditCampaign
);

module.exports = router;
