const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || "temp_hackathon_fallback_secret_12345";
  
  if (!process.env.JWT_SECRET) {
    console.warn("⚠️ WARNING: JWT_SECRET is not defined in environment variables. Using a fallback secret (Insecure!).");
  }

  return jwt.sign(
    { id: user._id, role: user.role },
    secret,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;