const Product = require("../models/product");

// @desc   Create new product
// @route  POST /api/products
// @access Seller only
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, location } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      location,
      seller: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all products
// @route  GET /api/products
// @access Public
const getProducts = async (req, res) => {
  const products = await Product.find().populate("seller", "name email");
  res.json(products);
};


// @desc   Search & filter products
// @route  GET /api/products/search
// @access Public
const searchProducts = async (req, res) => {
  try {
    const { keyword, category, location, minPrice, maxPrice } = req.query;

    let query = {};

    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = location;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    const products = await Product.find(query).populate("seller", "name email");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Seller only
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await product.deleteOne();

    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Seller only
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.location = req.body.location || product.location;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get seller's own products
// @route  GET /api/products/my-products
// @access Seller
const getMyProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user._id });
  res.json(products);
};


module.exports = {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  searchProducts,
  getMyProducts,
};

