const Order = require("../models/order");
const Product = require("../models/product");

// @desc   Create order
// @route  POST /api/orders
// @access Buyer
const createOrder = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const order = await Order.create({
      buyer: req.user._id,
      seller: product.seller,
      product: product._id,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get buyer orders
// @route  GET /api/orders/my-orders
// @access Buyer
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate("product")
    .populate("seller", "name email");

  res.json(orders);
};

// @desc   Get seller orders
// @route  GET /api/orders/seller
// @access Seller
const getSellerOrders = async (req, res) => {
  const orders = await Order.find({ seller: req.user._id })
    .populate("product")
    .populate("buyer", "name email");

  res.json(orders);
};

// @desc   Update order status
// @route  PUT /api/orders/:id
// @access Seller
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.seller.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  order.status = status;
  await order.save();

  res.json(order);
};

module.exports = {
  createOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
};
