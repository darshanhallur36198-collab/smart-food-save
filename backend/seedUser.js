require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seed() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error("MONGO_URI not found in .env");

        await mongoose.connect(uri);
        console.log("✅ Connected to MongoDB for seeding...");

        const email = "darshanhallur36198@gmail.com";
        const password = "password123"; // Adjust if you want a different password
        const hashed = await bcrypt.hash(password, 10);
        
        // Remove existing to be sure or just update
        await User.deleteOne({ email });
        
        await User.create({ 
            name: "Darshan", 
            email, 
            password: hashed, 
            role: "admin" 
        });

        console.log(`✅ User ${email} created successfully with password: ${password}`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
        process.exit(1);
    }
}

seed();
