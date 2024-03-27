const { check } = require('express-validator');

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const categoryModel = require("../../models/categoryModel");

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required.")
    .isString()
    .withMessage("Category name must be of type string.")
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters.")
    .isLength({ max: 32 })
    .withMessage("Category name cannot exceed 32 characters."),

  validatorMiddleware,
];

exports.getCategoryValidator = [
  check("id")
  .isMongoId()
  .withMessage("Invalid category ID format."),

  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check(`id`)
    .isMongoId()
    .withMessage(`Invalid category ID format.`)
    .custom(async (id) => {
      const category = await categoryModel.findById(id);
      if (!category) {
        throw new Error(`No category for this id ${id}`);
      };
      return true;
    }),

  check("name")
    .optional()
    .isString()
    .withMessage("Category name must be of type string.")
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters.")
    .isLength({ max: 32 })
    .withMessage("Category name cannot exceed 32 characters."),

  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id")
  .isMongoId()
  .withMessage("Invalid category ID format."),

  validatorMiddleware,
];