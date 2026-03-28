const router = require("express").Router();
const Meal = require("../models/Meal");
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/mealController");

router.post("/create", auth, controller.createMeal);
router.post("/register", auth, controller.registerMeal); 
router.get("/forecast", controller.getForecast);

module.exports = router;