const {
  getAll,
  getOne,
} = require("./handlersFactory");

const categoryModel = require(`../models/categoryModel`);

// @desc Get list of categories
// @route GET /api/v1/categories
// @access
exports.getCategories = getAll(categoryModel);

// @desc Get category by id
// @route GET /api/v1/categories/:id
// @access
exports.getCategory = getOne(categoryModel, 'category');