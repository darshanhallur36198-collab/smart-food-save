const mongoose = require('mongoose');
require('dotenv').config();

console.log("Attempting to connect with URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ Successfully connected to MongoDB!");
    process.exit(0);
})
.catch(err => {
    console.error("❌ Connection failed!");
    console.error(err);
    process.exit(1);
});
