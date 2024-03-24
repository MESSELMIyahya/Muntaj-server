const {
  getAll,
  getOne,
} = require("./handlersFactory");

const productModel = require(`../models/productModel`);

// @desc Get list of products
// @route GET /api/v1/product
// @access
exports.getProducts = getAll(productModel);

// @desc Get product by id
// @route GET /api/v1/product/:id
// @access
exports.getProduct = getOne(productModel, 'product');