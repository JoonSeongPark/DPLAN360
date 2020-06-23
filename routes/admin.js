const express = require("express");

const router = express.Router();

const adminMediaController = require("../controllers/admin/media");
const adminAgencyController = require("../controllers/admin/agency");
const adminAdvertiserController = require("../controllers/admin/advertiser");
const authMiddleware = require("../middleware/is-auth");

const categoryController = require("../controllers/admin/category");

router.get("/media", authMiddleware.isAuth, adminMediaController.getMedia);
router.get(
  "/add-media",
  authMiddleware.isAdmin,
  adminMediaController.getAddMedia
);
router.post(
  "/add-media",
  authMiddleware.isAdmin,
  adminMediaController.postAddMedia
);
router.get(
  "/edit-media/:mediumId",
  authMiddleware.isAdmin,
  adminMediaController.getEditMedia
);
router.post(
  "/edit-media",
  authMiddleware.isAdmin,
  adminMediaController.postEditMedia
);
router.post(
  "/delete-media",
  authMiddleware.isAdmin,
  adminMediaController.postDeleteMedia
);

router.get(
  "/agencies",
  authMiddleware.isAuth,
  adminAgencyController.getAgencies
);
router.get(
  "/add-agency",
  authMiddleware.isAdmin,
  adminAgencyController.getAddAgency
);
router.post(
  "/add-agency",
  authMiddleware.isAdmin,
  adminAgencyController.postAddAgency
);
router.get(
  "/edit-agency/:agencyId",
  authMiddleware.isAdmin,
  adminAgencyController.getEditAgency
);
router.post(
  "/edit-agency",
  authMiddleware.isAdmin,
  adminAgencyController.postEditAgency
);
router.post(
  "/delete-agency",
  authMiddleware.isAdmin,
  adminAgencyController.postDeleteAgency
);

router.get(
  "/advertisers",
  authMiddleware.isAuth,
  adminAdvertiserController.getAdvertisers
);
router.get(
  "/add-advertiser",
  authMiddleware.isAdmin,
  adminAdvertiserController.getAddAdvertiser
);
router.post(
  "/add-advertiser",
  authMiddleware.isAdmin,
  adminAdvertiserController.postAddAdvertiser
);
router.get(
  "/edit-advertiser/:advertiserId",
  authMiddleware.isAdmin,
  adminAdvertiserController.getEditAdvertiser
);
router.post(
  "/edit-advertiser",
  authMiddleware.isAdmin,
  adminAdvertiserController.postEditAdvertiser
);
router.post(
  "/delete-advertiser",
  authMiddleware.isAdmin,
  adminAdvertiserController.postDeleteAdvertiser
);

router.get(
  "/categories",
  authMiddleware.isAuth,
  categoryController.getCategories
);
router.get(
  "/add-category",
  authMiddleware.isAdmin,
  categoryController.getAddCategory
);
router.post(
  "/add-main-category",
  authMiddleware.isAdmin,
  categoryController.postAddMain
);
router.get(
  "/edit-main-category/:mainId",
  authMiddleware.isAdmin,
  categoryController.getEditMain
);
router.post(
  "/edit-main-category",
  authMiddleware.isAdmin,
  categoryController.postEditMain
);
router.post(
  "/delete-main-category",
  authMiddleware.isAdmin,
  categoryController.postDeleteMain
);
router.post(
  "/add-sub-category",
  authMiddleware.isAdmin,
  categoryController.postAddSub
);
router.get(
  "/edit-sub-category/:subId",
  authMiddleware.isAdmin,
  categoryController.getEditSub
);
router.post(
  "/edit-sub-category",
  authMiddleware.isAdmin,
  categoryController.postEditSub
);
router.post(
  "/delete-sub-category",
  authMiddleware.isAdmin,
  categoryController.postDeleteSub
);

module.exports = router;
