const { check } = require('express-validator');
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getStoreValidator = [
  check("id")
  .isMongoId()
  .withMessage("Invalid store ID format."),

  validatorMiddleware,
];