const express = require("express");

const router = express.Router();

const infoController = require("../controllers/work/info");
const authMiddleware = require("../middleware/is-auth");

router.get(
  "/advertisers",
  authMiddleware.isAuth,
  infoController.getAdvertisers
);

router.get("/agencies", authMiddleware.isAuth, infoController.getAgencies);

router.get("/media", authMiddleware.isAuth, infoController.getMedia);

router.get("/categories", authMiddleware.isAuth, infoController.getCategories);

router.get("/users", authMiddleware.isAuth, infoController.getUsers);

module.exports = router;
