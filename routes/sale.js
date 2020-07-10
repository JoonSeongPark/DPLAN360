const express = require("express");

const router = express.Router();

const saleController = require("../controllers/work/sale");
const authMiddleware = require("../middleware/is-auth");

router.get("/", authMiddleware.isAuth, saleController.getIndex);

router.get("/sales", authMiddleware.isAuth, saleController.getSales);

router.get("/media-sales", authMiddleware.isAuth, saleController.getMediaSales);

module.exports = router;
