const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, 'startup_debug.log');

function log(msg) {
    const formatted = `[DEBUG ${new Date().toISOString()}] ${msg}\n`;
    fs.appendFileSync(logFile, formatted);
    console.log(msg);
}

fs.writeFileSync(logFile, '--- Startup Debug Log ---\n');

try {
    log('Loading dotenv...');
    require("dotenv").config();
    log('dotenv loaded.');

    const express = require("express");
    const mongoose = require("mongoose");
    const cors = require("cors");
    const http = require("http");
    const errorHandler = require("./utils/errorHandler");
    const { initSocket } = require("./services/notificationService");

    log('Modules required.');

    const app = express();
    const server = http.createServer(app);

    log('Express app and server created.');

    initSocket(server);
    log('Socket initialized.');

    app.use(cors());
    app.use(express.json());
    app.use(errorHandler);

    log('Connecting to MongoDB: ' + process.env.MONGO_URI);
    mongoose.connect(process.env.MONGO_URI)
        .then(() => log("✅ MongoDB Atlas Connected!"))
        .catch(err => log("❌ Connection Error: " + err.stack));

    server.listen(5002, () => log("Server running on port 5002")); // Use 5002 to avoid conflicts

} catch (err) {
    log('CRITICAL ERROR DURING STARTUP: ' + err.stack);
    process.exit(1);
}
