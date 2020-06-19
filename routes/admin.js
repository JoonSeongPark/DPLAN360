const express = require("express");

const router = express.Router();

const adminMediaController = require("../controllers/admin/media");
const adminAgencyController = require("../controllers/admin/agency");
const adminAdvertiserController = require("../controllers/admin/advertiser");

const categoryController = require("../controllers/admin/category");

router.get("/media", adminMediaController.getMedia);
router.get("/add-media", adminMediaController.getAddMedia);
router.post("/add-media", adminMediaController.postAddMedia);
router.get("/edit-media/:mediumId", adminMediaController.getEditMedia);
router.post("/edit-media", adminMediaController.postEditMedia);
router.post("/delete-media", adminMediaController.postDeleteMedia);

router.get("/agencies", adminAgencyController.getAgencies);
router.get("/add-agency", adminAgencyController.getAddAgency);
router.post("/add-agency", adminAgencyController.postAddAgency);
router.get("/edit-agency/:agencyId", adminAgencyController.getEditAgency);
router.post("/edit-agency", adminAgencyController.postEditAgency);
router.post("/delete-agency", adminAgencyController.postDeleteAgency);

router.get("/advertisers", adminAdvertiserController.getAdvertisers);
router.get("/add-advertiser", adminAdvertiserController.getAddAdvertiser);
router.post("/add-advertiser", adminAdvertiserController.postAddAdvertiser);
// router.get("/edit-advertiser/:advertiserId", adminAdvertiserController.getEditAdvertiser);
// router.post("/edit-advertiser", adminAdvertiserController.postEditAdvertiser);
router.post(
  "/delete-advertiser",
  adminAdvertiserController.postDeleteAdvertiser
);

router.get("/categories", categoryController.getCategories);
router.get("/add-category", categoryController.getAddCategory);
router.post("/add-main-category", categoryController.postAddMain);
router.get("/edit-main-category/:mainId", categoryController.getEditMain);
router.post("/edit-main-category", categoryController.postEditMain);
router.post("/delete-main-category", categoryController.postDeleteMain);
router.post("/add-sub-category", categoryController.postAddSub);
router.get("/edit-sub-category/:subId", categoryController.getEditSub);
router.post("/edit-sub-category", categoryController.postEditSub);
router.post("/delete-sub-category", categoryController.postDeleteSub);

module.exports = router;
