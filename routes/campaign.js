const express = require("express");

const router = express.Router();

const campaignController = require("../controllers/work/campaign");
const authMiddleware = require("../middleware/is-auth");

router.get(
  "/campaign/:campaignId",
  authMiddleware.isAuth,
  campaignController.getCampaign
);

router.get(
  "/add-campaign",
  authMiddleware.isAuth,
  authMiddleware.isNotNormal,
  campaignController.getAddCampaign
);
router.post(
  "/add-campaign",
  authMiddleware.isAuth,
  authMiddleware.isNotNormal,
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

router.post(
  "/delete-campaign/:campaignId",
  authMiddleware.isAuth,
  campaignController.postDeleteCampaign
);

module.exports = router;
