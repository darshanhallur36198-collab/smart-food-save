const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Inventory = require("./models/Inventory");

const mockData = [
  {
    item: "Milk (Toned)",
    quantity: 5,
    expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expiring tomorrow
  },
  {
    item: "Basmati Rice",
    quantity: 100,
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // Expiring in 6 months
  },
  {
    item: "Organic Tomatoes",
    quantity: 12,
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // Expiring in 5 days
  },
  {
    item: "Whole Wheat Bread",
    quantity: 2,
    expiryDate: new Date() // Expiring today
  },
  {
    item: "Chicken Breast",
    quantity: 8,
    expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // Expired 2 days ago
  },
  {
    item: "Amul Butter",
    quantity: 25,
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // Healthy stock
  }
];

async function seedDB() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected! Clearing existing inventory...");
    
    await Inventory.deleteMany({});
    console.log("✅ Collection cleared. Inserting mock data...");
    
    await Inventory.insertMany(mockData);
    console.log("✅ Successfully seeded 6 items into the database!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDB();
