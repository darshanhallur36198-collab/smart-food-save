const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  foodAmount: { type: Number, required: true },
  location: { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  status: { type: String, enum: ["Pending", "Assigned", "Picked Up", "Delivered"], default: "Pending" },
  ngoName: { type: String, default: null },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });

module.exports = mongoose.model("Donation", donationSchema);