const express = require("express");

const authController = require("../controllers/admin/auth");
const authMiddleware = require("../middleware/is-auth");

const router = express.Router();

router.get("/login", authMiddleware.isLogin, authController.getLogin);

router.post("/login", authMiddleware.isLogin, authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/reset-password", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);

router.get("/new-password/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
