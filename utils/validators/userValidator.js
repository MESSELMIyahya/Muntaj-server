const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.userUpdateMyDataValidator = [
  check("firstName")
    .optional()
    .isString()
    .withMessage("First name must be of type string.")
    .isLength({ min: 2, max: 16 })
    .withMessage("First name should be between 2 and 16 characters"),

  check("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be of type string.")
    .isLength({ min: 2, max: 16 })
    .withMessage("Last name should be between 2 and 16 characters"),

  check("userName")
    .optional()
    .isString()
    .withMessage("user name must be of type string.")
    .isLength({ min: 4, max: 32 })
    .withMessage("user name should be between 4 and 32 characters"),

  check("country")
    .optional()
    .isString()
    .withMessage("Country name must be of type string.")
    .isLength({ min: 2, max: 16 })
    .withMessage("Country name should be between 2 and 16 characters"),

  check("profileImage")
    .custom((_, { req }) => {
      if (!(req.body.profileImage === undefined)) {
        throw new Error('The field you entered for profileImage is not an Image type.');
      };
      return true;
    }),

  validatorMiddleware,
];