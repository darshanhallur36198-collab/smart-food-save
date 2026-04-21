/**
 * mongodbPing.js
 * 
 * This is a minimal script to verify your MongoDB Atlas connection.
 * It follows the complete flow: Connect -> Ping -> Report -> Close.
 * 
 * INSTALL: npm install mongoose dotenv
 * RUN:     node mongodbPing.js
 */

const mongoose = require("mongoose");
require("dotenv").config();

async function runCheck() {
  // 1. Retrieve the connection string from environment variables
  // If not found, it defaults to an empty string to trigger the error handler below
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || "";

  if (!uri) {
    console.error("❌ ERROR: No connection string found! Make sure MONGO_URI is set in your .env file.");
    return;
  }

  console.log("⏳ Attempting to connect to MongoDB Atlas...");

  try {
    // 2. Connect to the MongoDB cluster
    // Setting a timeout helps avoid hanging if the network or IP whitelist is the issue
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ Step 1: Physical connection established.");

    // 3. Verify the connection with a lightweight 'ping' command
    // This ensures the database is not just reachable, but also responding to queries.
    const db = mongoose.connection.db;
    const result = await db.admin().command({ ping: 1 });
    
    if (result && result.ok) {
      console.log("✅ Step 2: Database 'ping' successful! Your cluster is healthy.");
      console.log("\n⭐️ SUCCESS: You are fully connected to MongoDB Atlas! 🚀");
    }

  } catch (error) {
    console.error("\n❌ CONNECTION FAILED!");
    console.error("--------------------------------------------------");
    console.error(`Message: ${error.message}`);
    console.log("\n💡 COMMON FIXES:");
    console.log("1. Check if your IP address is whitelisted in MongoDB Atlas (Network Access).");
    console.log("2. Verify that your username and password in the URI are correct.");
    console.log("3. Ensure there are no special characters in the password that aren't URL-encoded.");
    console.error("--------------------------------------------------");
  } finally {
    // 4. Always close the connection to clean up resources
    await mongoose.disconnect();
    console.log("\n🔌 Connection closed. Check complete.");
  }
}

runCheck();
