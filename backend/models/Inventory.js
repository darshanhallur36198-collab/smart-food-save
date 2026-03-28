const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  item: String,
  quantity: Number,
  expiryDate: Date
});

module.exports = mongoose.model("Inventory", inventorySchema);