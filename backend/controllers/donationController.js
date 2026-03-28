const Donation = require("../models/Donation");

exports.createDonation = async (req, res) => {
  try {
    const donation = await Donation.create(req.body);
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: "Error creating donation", error: err.message });
  }
};

exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching donations", error: err.message });
  }
};

exports.updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ngoName } = req.body;
    const updated = await Donation.findByIdAndUpdate(id, { status, ...(ngoName && { ngoName }) }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating donation", error: err.message });
  }
};