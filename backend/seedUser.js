require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seed() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error("❌ ERROR: MONGO_URI is missing from environment variables.");
            console.log("Please add MONGO_URI in your Render Dashboard or .env file.");
            process.exit(1);
        }

        await mongoose.connect(uri);
        console.log("✅ Connected to MongoDB for seeding...");

        // Use env vars for credentials if available, otherwise use defaults
        const email = process.env.ADMIN_EMAIL || "darshanhallur36198@gmail.com";
        const password = process.env.ADMIN_PASSWORD || "password123";
        const hashed = await bcrypt.hash(password, 10);
        
        // Remove existing to be sure or just update
        await User.deleteOne({ email });
        
        await User.create({ 
            name: "Admin User", 
            email, 
            password: hashed, 
            role: "admin" 
        });

        console.log(`✅ Admin user created/updated: ${email}`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
        process.exit(1);
    }
}

seed();

