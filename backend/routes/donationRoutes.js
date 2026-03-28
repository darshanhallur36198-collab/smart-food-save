const router = require("express").Router();
const controller = require("../controllers/donationController");

router.post("/create", controller.createDonation);
router.get("/", controller.getDonations);
router.put("/:id", controller.updateDonationStatus);

module.exports = router;