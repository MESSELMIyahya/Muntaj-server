const { check } = require('express-validator');
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getProductValidator = [
  check("id")
  .isMongoId()
  .withMessage("Invalid product ID format."),

  validatorMiddleware,
];