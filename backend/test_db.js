require("dotenv").config();
const mongoose = require("mongoose");

const ALT_URI = "mongodb://rahulpatted:rahul123@ac-rdrfv9e-shard-00-00.ocgcibu.mongodb.net:27017,ac-rdrfv9e-shard-00-01.ocgcibu.mongodb.net:27017,ac-rdrfv9e-shard-00-02.ocgcibu.mongodb.net:27017/foodwaste?ssl=true&replicaSet=atlas-fwnx44-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(ALT_URI, { serverSelectionTimeoutMS: 5000 })
.then(() => {
  console.log("✅ MongoDB Connection Successful (Unrolled URI)");
  process.exit(0);
})
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err.message);
  process.exit(1);
});
