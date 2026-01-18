const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Protected route (profile)
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;