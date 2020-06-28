const express = require("express");

const router = express.Router();

const workController = require("../controllers/work");
const authMiddleware = require("../middleware/is-auth");

router.get("/", authMiddleware.isAuth, workController.getIndex);

router.get("/sales", authMiddleware.isAuth, workController.getSales);

router.get("/media-sales", authMiddleware.isAuth, workController.getMediaSales);

router.get("/add-campaign", authMiddleware.isAuth, workController.getAddCampaign);
router.post("/add-campaign", authMiddleware.isAuth, workController.postAddCampaign);

module.exports = router;
