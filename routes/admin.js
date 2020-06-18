const express = require("express");

const router = express.Router();

const adminMediaController = require("../controllers/admin/media");
const adminAgencyController = require("../controllers/admin/agency");

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

module.exports = router;
