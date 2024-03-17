const {
  resizeImage,
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const categoryModel = require(`../models/categoryModel`);

// Upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = resizeImage('categories', 'category');

// @desc Create category
// @route POST /api/v1/categories
// @access
exports.createCategory = createOne(categoryModel);

// @desc Get list of categories
// @route GET /api/v1/categories
// @access
exports.getCategories = getAll(categoryModel);

// @desc Get category by id
// @route GET /api/v1/categories/:id
// @access
exports.getCategory = getOne(categoryModel, 'category');

// @desc Update category by id
// @route PUT /api/v1/categories/:id
// @access
exports.updateCategory = updateOne(categoryModel, 'category');

// @desc Delete category by id
// @route DELETE /api/v1/categories/:id
// @access
exports.deleteCategory = deleteOne(categoryModel, 'category', true);