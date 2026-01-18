const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

// Buyer
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

// Seller
router.get("/seller", protect, getSellerOrders);
router.put("/:id", protect, updateOrderStatus);

module.exports = router;
