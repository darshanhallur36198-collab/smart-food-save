const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb+srv://sagarsmokashi607_db_user:oNXPao34nAGQabRr@cluster0.xwavnkv.mongodb.net/foodwaste?retryWrites=true&w=majority&appName=Cluster0")
.then(async () => {
    console.log("Connected to MongoDB for seeding...");
    const email = "admin@foodsave.com";
    const password = "password123";
    const hashed = await bcrypt.hash(password, 10);
    
    // Check if exists
    const existing = await User.findOne({ email });
    if (existing) {
        console.log("User already exists. Updating password to password123");
        existing.password = hashed;
        await existing.save();
    } else {
        await User.create({ name: "Admin", email, password: hashed, role: "admin" });
        console.log("Admin user created successfully.");
    }
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
