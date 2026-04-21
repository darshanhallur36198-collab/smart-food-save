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

// 1. Check for MONGO_URI and provide helpful logs for Render
if (!process.env.MONGO_URI) {
  console.warn("  WARNING: MONGO_URI is not defined in environment variables!");
  console.warn("If this is Render, please add MONGO_URI in the Dashboard -> Environment section.");
}

// 2. Connect to MongoDB (non-blocking)
mongoose.connect(process.env.MONGO_URI || "")
  .then(() => console.log(" MongoDB Atlas Connected Successfully"))
  .catch(err => console.error(" MongoDB Connection Error:", err.message));

// 3. Super-Resilient Health Check Route
app.get("/", (req, res) => {
  res.status(200).send("Smart Food Save API is running successfully!");
});


// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/meals", require("./routes/mealRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/waste", require("./routes/wasteRoutes"));
app.use("/api/donation", require("./routes/donationRoutes"));

// Error Handler must be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Health check available at /");
});
