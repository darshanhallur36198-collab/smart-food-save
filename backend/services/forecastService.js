const axios = require("axios");

// Call Python AI API
exports.getMealForecast = async (day, attendance) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/predict?day=${day}&attendance=${attendance}`
    );

    return res.data.prediction;
  } catch (err) {
    console.error("Forecast error:", err.message);

    // fallback logic (important in production)
    return attendance * 0.9;
  }
};