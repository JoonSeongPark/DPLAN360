const express = require("express");

const router = express.Router();

const saleController = require("../controllers/work/sale");
const authMiddleware = require("../middleware/is-auth");

router.get("/", authMiddleware.isAuth, saleController.getIndex);

router.get("/sales", authMiddleware.isAuth, saleController.getSales);

router.get("/media-sales", authMiddleware.isAuth, saleController.getMediaSales);

router.get("/advertiser-sales", authMiddleware.isAuth, saleController.getAdvertiserSales);

router.get("/agency-sales", authMiddleware.isAuth, saleController.getAgencySales);

router.get("/medium-sales", authMiddleware.isAuth, saleController.getMediaItemSales);

module.exports = router;
