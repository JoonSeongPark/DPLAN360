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

module.exports = router;
