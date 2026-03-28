require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const errorHandler = require("./utils/errorHandler");
const { initSocket } = require("./services/notificationService");

const app = express();
const server = http.createServer(app);

// Initialize WebSockets securely using the service
initSocket(server);

app.use(cors());
app.use(express.json());
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Atlas Connected via .env Successfully"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/meals", require("./routes/mealRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/waste", require("./routes/wasteRoutes"));
app.use("/api/donation", require("./routes/donationRoutes"));

server.listen(5000, () => console.log("Server running on port 5000"));