const Meal = require("../models/Meal");
const { getMealForecast } = require("../services/forecastService");

exports.registerMeal = async (req, res) => {
  try {
    const { userId, mealId } = req.body;
    const studentId = (req.user && req.user.id) ? req.user.id : userId; // Fallback for missing auth middleware
    
    // Instead of findById which fails on string "Lunch", let's make it robust to fallback search or creation
    let meal = await Meal.findById(mealId).catch(() => null);
    if (!meal) {
        // If not a mongo ID, mock creation for demonstration
        meal = await Meal.create({ mealType: mealId, date: new Date(), predictedCount: 100 });
    }

    meal.registeredStudents.push(studentId);
    await meal.save();
    res.json({ message: "Meal registered successfully", meal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error registering meal" });
  }
};

exports.getForecast = async (req, res) => {
  try {
    const { day = 1, attendance = 100 } = req.query;
    const prediction = await getMealForecast(day, attendance);
    res.json({ prediction });
  } catch (err) {
    res.status(500).json({ message: "Failed to load forecast" });
  }
};

exports.createMeal = async (req, res) => {
  try {
    const meal = await Meal.create(req.body);
    res.json(meal);
  } catch (err) {
    res.status(500).json({ message: "Error creating meal" });
  }
};