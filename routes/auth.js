const express = require("express");

const authController = require("../controllers/admin/auth");
const authMiddleware = require("../middleware/is-auth");

const router = express.Router();

router.get("/login", authMiddleware.isLogin, authController.getLogin);

router.post("/login", authMiddleware.isLogin, authController.postLogin);

router.get(
  "/admin/user-signup",
  authMiddleware.isLeader,
  authController.getUserSignup
);

router.post(
  "/admin/user-signup",
  authMiddleware.isLeader,
  authController.postUserSignup
);

router.post("/logout", authController.postLogout);

module.exports = router;
