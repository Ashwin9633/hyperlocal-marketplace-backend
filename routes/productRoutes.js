const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  searchProducts,
  getMyProducts,
} = require("../controllers/productController");




const { protect } = require("../middleware/authMiddleware");


router.get("/search", searchProducts);
router.get("/my-products", protect, getMyProducts);
router.get("/", getProducts);
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
