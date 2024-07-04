const Product = require("../models/product");

const ErrorHandler = require("../utils/errrorHandler");
const APIFeatures = require("../utils/apiFeatures");
const catchAsyncErrors = require("../middlewares/catchSynchErrors");

// Create new product   =>   /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get all products   =>   /api/v1/products ? keyword=apple
exports.getProducts = async (req, res, next) => {
  const resPerPage = 4;
  const productsCount = await Product.countDocuments();

  // jsonwebtoken validator nodemailer
  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter();
  const products = await apiFeatures.query;
  res.status(200).json({
    success: true,
    count: products.length,
    productCount,
    products,
  });
};

// Get single product details   =>   /api/v1/product/:id

exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
    // res.status(404).json({ message: `Product not found` });
  }
  res.status(200).json({
    message: `success`,
    product,
  });
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Product not found`,
    });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ message: `success`, product });
};

// Delete Product  => /api/v1/product/:id
exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // await product.remove();

  await Product.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "product is deleted",
  });
};
