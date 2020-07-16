const express = require("express");

const router = express.Router();

const adminMediaController = require("../controllers/admin/media");
const adminAgencyController = require("../controllers/admin/agency");
const adminAdvertiserController = require("../controllers/admin/advertiser");
const adminTeamController = require("../controllers/admin/team");
const authMiddleware = require("../middleware/is-auth");

const categoryController = require("../controllers/admin/category");

// admin media
router.get(
  "/add-media",
  authMiddleware.isLeader,
  adminMediaController.getAddMedia
);
router.post(
  "/add-media",
  authMiddleware.isLeader,
  adminMediaController.postAddMedia
);
router.get(
  "/edit-media/:mediumId",
  authMiddleware.isLeader,
  adminMediaController.getEditMedia
);
router.post(
  "/edit-media",
  authMiddleware.isLeader,
  adminMediaController.postEditMedia
);
router.post(
  "/delete-media",
  authMiddleware.isLeader,
  adminMediaController.postDeleteMedia
);

// admin agency
router.get(
  "/add-agency",
  authMiddleware.isLeader,
  adminAgencyController.getAddAgency
);
router.post(
  "/add-agency",
  authMiddleware.isLeader,
  adminAgencyController.postAddAgency
);
router.get(
  "/edit-agency/:agencyId",
  authMiddleware.isLeader,
  adminAgencyController.getEditAgency
);
router.post(
  "/edit-agency",
  authMiddleware.isLeader,
  adminAgencyController.postEditAgency
);
router.post(
  "/delete-agency",
  authMiddleware.isLeader,
  adminAgencyController.postDeleteAgency
);

// admin advertiser
router.get(
  "/add-advertiser",
  authMiddleware.isLeader,
  adminAdvertiserController.getAddAdvertiser
);
router.post(
  "/add-advertiser",
  authMiddleware.isLeader,
  adminAdvertiserController.postAddAdvertiser
);
router.get(
  "/edit-advertiser/:advertiserId",
  authMiddleware.isLeader,
  adminAdvertiserController.getEditAdvertiser
);
router.post(
  "/edit-advertiser",
  authMiddleware.isLeader,
  adminAdvertiserController.postEditAdvertiser
);
router.post(
  "/delete-advertiser",
  authMiddleware.isLeader,
  adminAdvertiserController.postDeleteAdvertiser
);

// admin category
router.get(
  "/add-category",
  authMiddleware.isLeader,
  categoryController.getAddCategory
);
router.post(
  "/add-main-category",
  authMiddleware.isLeader,
  categoryController.postAddMain
);
router.get(
  "/edit-main-category/:mainId",
  authMiddleware.isLeader,
  categoryController.getEditMain
);
router.post(
  "/edit-main-category",
  authMiddleware.isLeader,
  categoryController.postEditMain
);
router.post(
  "/delete-main-category",
  authMiddleware.isLeader,
  categoryController.postDeleteMain
);
router.post(
  "/add-sub-category",
  authMiddleware.isLeader,
  categoryController.postAddSub
);
router.get(
  "/edit-sub-category/:subId",
  authMiddleware.isLeader,
  categoryController.getEditSub
);
router.post(
  "/edit-sub-category",
  authMiddleware.isLeader,
  categoryController.postEditSub
);
router.post(
  "/delete-sub-category",
  authMiddleware.isLeader,
  categoryController.postDeleteSub
);

// admin team
router.get(
  "/add-team",
  authMiddleware.isLeader,
  adminTeamController.getAddTeam
);
router.post(
  "/add-team",
  authMiddleware.isLeader,
  adminTeamController.postAddTeam
);

module.exports = router;
