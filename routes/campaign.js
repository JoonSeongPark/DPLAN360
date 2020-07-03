const express = require("express");

const router = express.Router();

const workController = require("../controllers/work");
const authMiddleware = require("../middleware/is-auth");

router.get("/add-campaign", authMiddleware.isAuth, workController.getAddCampaign);
router.post("/add-campaign", authMiddleware.isAuth, workController.postAddCampaign);

module.exports = router;
