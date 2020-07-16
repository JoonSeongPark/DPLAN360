const express = require("express");

const authController = require("../controllers/admin/auth");
const authMiddleware = require("../middleware/is-auth");

const router = express.Router();

router.get("/login", authMiddleware.isLogin, authController.getLogin);

router.post("/login", authMiddleware.isLogin, authController.postLogin);

router.post("/logout", authController.postLogout);

module.exports = router;
