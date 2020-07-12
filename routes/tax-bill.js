const express = require("express");

const router = express.Router();

const taxBillController = require("../controllers/work/tax-bill");
const authMiddleware = require("../middleware/is-auth");

router.get("/tax-bill", authMiddleware.isAuth, taxBillController.getTaxBill);

module.exports = router;
